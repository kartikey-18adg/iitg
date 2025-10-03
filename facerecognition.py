"""
Face Recognition Module for Campus Security System
Handles CCTV footage processing, face detection, embedding generation, and identity matching
"""

import cv2
import numpy as np
from deepface import DeepFace
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from pathlib import Path
import pickle
import json
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')


class FaceRecognitionSystem:
    """
    Complete face recognition system for campus security monitoring
    Generates embeddings from raw images and identifies people using similarity scores
    """
    
    def __init__(self, model_name='Facenet512', distance_metric='cosine'):
        """
        Initialize face recognition system
        
        Args:
            model_name: DeepFace model ('VGG-Face', 'Facenet', 'Facenet512', 'OpenFace', 'ArcFace')
            distance_metric: Distance metric ('cosine', 'euclidean', 'euclidean_l2')
        """
        self.model_name = model_name
        self.distance_metric = distance_metric
        self.face_database = {}  # {person_id: [embeddings]}
        self.face_metadata = {}  # {person_id: {images: [], timestamps: []}}
        self.similarity_threshold = 0.6  # Cosine similarity threshold
        
        print(f"Initialized Face Recognition System")
        print(f"Model: {model_name}")
        print(f"Distance Metric: {distance_metric}")
    
    def extract_faces_from_frame(self, frame):
        """
        Extract all faces from a single frame/image
        
        Args:
            frame: numpy array (image)
            
        Returns:
            list of face dictionaries with coordinates and cropped faces
        """
        try:
            # Detect faces using DeepFace backend
            face_objs = DeepFace.extract_faces(
                img_path=frame,
                detector_backend='opencv',
                enforce_detection=False
            )
            
            faces = []
            for idx, face_obj in enumerate(face_objs):
                if face_obj['confidence'] > 0.9:  # High confidence only
                    faces.append({
                        'face_id': idx,
                        'coordinates': face_obj['facial_area'],
                        'confidence': face_obj['confidence'],
                        'face_array': face_obj['face']
                    })
            
            return faces
        except Exception as e:
            print(f"Error extracting faces: {e}")
            return []
    
    def generate_embedding(self, face_image):
        """
        Generate face embedding from a single face image
        
        Args:
            face_image: numpy array of face image
            
        Returns:
            numpy array: face embedding vector
        """
        try:
            # Generate embedding using DeepFace
            embedding_obj = DeepFace.represent(
                img_path=face_image,
                model_name=self.model_name,
                enforce_detection=False
            )
            
            # Extract embedding vector
            embedding = np.array(embedding_obj[0]['embedding'])
            return embedding
            
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return None
    
    def process_cctv_footage(self, video_path, sample_rate=30):
        """
        Process CCTV footage and extract face embeddings
        
        Args:
            video_path: Path to video file
            sample_rate: Process every Nth frame
            
        Returns:
            list of detected faces with embeddings and timestamps
        """
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = 0
        detected_faces = []
        
        print(f"Processing CCTV footage: {video_path}")
        print(f"Video FPS: {fps}, Sample Rate: {sample_rate}")
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Process every Nth frame
            if frame_count % sample_rate == 0:
                timestamp = frame_count / fps
                
                # Extract faces from frame
                faces = self.extract_faces_from_frame(frame)
                
                for face in faces:
                    # Generate embedding
                    embedding = self.generate_embedding(face['face_array'])
                    
                    if embedding is not None:
                        detected_faces.append({
                            'frame_number': frame_count,
                            'timestamp': timestamp,
                            'face_coordinates': face['coordinates'],
                            'confidence': face['confidence'],
                            'embedding': embedding,
                            'face_image': face['face_array']
                        })
                
                if frame_count % 300 == 0:
                    print(f"Processed {frame_count} frames, found {len(detected_faces)} faces")
        
        cap.release()
        print(f"\nTotal faces detected: {len(detected_faces)}")
        return detected_faces
    
    def process_image_folder(self, folder_path):
        """
        Process folder of images to build face database
        
        Args:
            folder_path: Path to folder containing person images
            
        Returns:
            dict: {person_id: [embeddings]}
        """
        folder = Path(folder_path)
        
        for person_folder in folder.iterdir():
            if person_folder.is_dir():
                person_id = person_folder.name
                embeddings = []
                images = []
                
                print(f"Processing person: {person_id}")
                
                for image_path in person_folder.glob('*'):
                    if image_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                        try:
                            # Read image
                            img = cv2.imread(str(image_path))
                            
                            # Generate embedding
                            embedding = self.generate_embedding(img)
                            
                            if embedding is not None:
                                embeddings.append(embedding)
                                images.append(str(image_path))
                        
                        except Exception as e:
                            print(f"Error processing {image_path}: {e}")
                
                if embeddings:
                    self.face_database[person_id] = embeddings
                    self.face_metadata[person_id] = {
                        'images': images,
                        'num_images': len(images),
                        'added_at': datetime.now().isoformat()
                    }
                    print(f"  Added {len(embeddings)} embeddings for {person_id}")
        
        print(f"\nDatabase built with {len(self.face_database)} people")
        return self.face_database
    
    def add_person_to_database(self, person_id, image_paths):
        """
        Add or update person in face database with multiple images
        
        Args:
            person_id: Unique identifier (e.g., student_id)
            image_paths: List of image file paths for this person
        """
        embeddings = []
        
        for img_path in image_paths:
            try:
                img = cv2.imread(img_path)
                embedding = self.generate_embedding(img)
                
                if embedding is not None:
                    embeddings.append(embedding)
            except Exception as e:
                print(f"Error processing {img_path}: {e}")
        
        if embeddings:
            if person_id in self.face_database:
                self.face_database[person_id].extend(embeddings)
                self.face_metadata[person_id]['images'].extend(image_paths)
                self.face_metadata[person_id]['num_images'] += len(embeddings)
            else:
                self.face_database[person_id] = embeddings
                self.face_metadata[person_id] = {
                    'images': image_paths,
                    'num_images': len(embeddings),
                    'added_at': datetime.now().isoformat()
                }
            
            print(f"Added {len(embeddings)} embeddings for {person_id}")
            return True
        return False
    
    def calculate_similarity(self, embedding1, embedding2):
        """
        Calculate cosine similarity between two embeddings
        
        Args:
            embedding1: First face embedding
            embedding2: Second face embedding
            
        Returns:
            float: Similarity score (0-1, higher is more similar)
        """
        if self.distance_metric == 'cosine':
            similarity = cosine_similarity(
                embedding1.reshape(1, -1),
                embedding2.reshape(1, -1)
            )[0][0]
            return similarity
        
        elif self.distance_metric == 'euclidean':
            distance = np.linalg.norm(embedding1 - embedding2)
            # Convert to similarity (inverse relationship)
            similarity = 1 / (1 + distance)
            return similarity
        
        else:
            raise ValueError(f"Unknown distance metric: {self.distance_metric}")
    
    def identify_face(self, query_embedding, top_k=3):
        """
        Identify person from query embedding using similarity scores
        
        Args:
            query_embedding: Face embedding to identify
            top_k: Return top K matches
            
        Returns:
            list: [(person_id, similarity_score, confidence)]
        """
        matches = []
        
        for person_id, embeddings in self.face_database.items():
            # Compare with all embeddings of this person
            similarities = []
            
            for stored_embedding in embeddings:
                sim = self.calculate_similarity(query_embedding, stored_embedding)
                similarities.append(sim)
            
            # Use maximum similarity (best match)
            max_similarity = max(similarities)
            avg_similarity = np.mean(similarities)
            
            matches.append({
                'person_id': person_id,
                'max_similarity': max_similarity,
                'avg_similarity': avg_similarity,
                'num_comparisons': len(similarities)
            })
        
        # Sort by max similarity
        matches = sorted(matches, key=lambda x: x['max_similarity'], reverse=True)
        
        # Return top K matches
        return matches[:top_k]
    
    def detect_duplicates(self, similarity_threshold=0.95):
        """
        Detect duplicate/similar images within the database
        
        Args:
            similarity_threshold: Threshold for considering images as duplicates
            
        Returns:
            list: Pairs of duplicate images
        """
        duplicates = []
        person_ids = list(self.face_database.keys())
        
        print(f"Checking for duplicates across {len(person_ids)} people...")
        
        for i, person1 in enumerate(person_ids):
            for person2 in person_ids[i+1:]:
                # Compare all embeddings between two people
                for emb1 in self.face_database[person1]:
                    for emb2 in self.face_database[person2]:
                        similarity = self.calculate_similarity(emb1, emb2)
                        
                        if similarity >= similarity_threshold:
                            duplicates.append({
                                'person1': person1,
                                'person2': person2,
                                'similarity': similarity,
                                'possible_duplicate': True
                            })
        
        print(f"Found {len(duplicates)} potential duplicates")
        return duplicates
    
    def process_real_time_stream(self, camera_index=0):
        """
        Process real-time camera feed for face recognition
        
        Args:
            camera_index: Camera device index (default 0 for webcam)
        """
        cap = cv2.VideoCapture(camera_index)
        frame_count = 0
        
        print("Starting real-time face recognition...")
        print("Press 'q' to quit")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Process every 10th frame
            if frame_count % 10 == 0:
                faces = self.extract_faces_from_frame(frame)
                
                for face in faces:
                    embedding = self.generate_embedding(face['face_array'])
                    
                    if embedding is not None:
                        matches = self.identify_face(embedding, top_k=1)
                        
                        if matches and matches[0]['max_similarity'] >= self.similarity_threshold:
                            person_id = matches[0]['person_id']
                            confidence = matches[0]['max_similarity']
                            
                            # Draw bounding box and label
                            coords = face['coordinates']
                            cv2.rectangle(
                                frame,
                                (coords['x'], coords['y']),
                                (coords['x'] + coords['w'], coords['y'] + coords['h']),
                                (0, 255, 0), 2
                            )
                            
                            label = f"{person_id}: {confidence:.2f}"
                            cv2.putText(
                                frame, label,
                                (coords['x'], coords['y'] - 10),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                0.5, (0, 255, 0), 2
                            )
            
            # Display frame
            cv2.imshow('Campus Security - Face Recognition', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()
    
    def save_database(self, filepath='face_database.pkl'):
        """Save face database to file"""
        data = {
            'database': self.face_database,
            'metadata': self.face_metadata,
            'model': self.model_name,
            'metric': self.distance_metric
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(data, f)
        
        print(f"Database saved to {filepath}")
    
    def load_database(self, filepath='face_database.pkl'):
        """Load face database from file"""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        
        self.face_database = data['database']
        self.face_metadata = data['metadata']
        self.model_name = data['model']
        self.distance_metric = data['metric']
        
        print(f"Database loaded from {filepath}")
        print(f"Loaded {len(self.face_database)} people")
    
    def generate_report(self, detected_faces, output_path='face_recognition_report.csv'):
        """
        Generate CSV report of detected faces
        
        Args:
            detected_faces: List of detected faces from CCTV processing
            output_path: Output CSV file path
        """
        report_data = []
        
        for face in detected_faces:
            # Identify face
            matches = self.identify_face(face['embedding'], top_k=1)
            
            if matches and matches[0]['max_similarity'] >= self.similarity_threshold:
                person_id = matches[0]['person_id']
                confidence = matches[0]['max_similarity']
                identified = True
            else:
                person_id = 'Unknown'
                confidence = 0.0
                identified = False
            
            report_data.append({
                'frame_number': face['frame_number'],
                'timestamp': face['timestamp'],
                'person_id': person_id,
                'confidence': confidence,
                'identified': identified,
                'face_confidence': face['confidence']
            })
        
        df = pd.DataFrame(report_data)
        df.to_csv(output_path, index=False)
        print(f"Report saved to {output_path}")
        
        return df


# Example Usage
if __name__ == "__main__":
    # Initialize system
    face_system = FaceRecognitionSystem(model_name='Facenet512', distance_metric='cosine')
    
    # Option 1: Build database from image folders
    # Structure: database/person_id/image1.jpg, image2.jpg, ...
    print("=" * 60)
    print("Building Face Database from Images")
    print("=" * 60)
    face_system.process_image_folder('face_database/')
    
    # Option 2: Add individual person with multiple images
    # face_system.add_person_to_database(
    #     person_id='STU00001',
    #     image_paths=['images/stu001_1.jpg', 'images/stu001_2.jpg', 'images/stu001_3.jpg']
    # )
    
    # Check for duplicates
    print("\n" + "=" * 60)
    print("Checking for Duplicate Images")
    print("=" * 60)
    duplicates = face_system.detect_duplicates(similarity_threshold=0.95)
    
    # Process CCTV footage
    print("\n" + "=" * 60)
    print("Processing CCTV Footage")
    print("=" * 60)
    detected_faces = face_system.process_cctv_footage(
        video_path='cctv_footage.mp4',
        sample_rate=30
    )
    
    # Generate report
    report = face_system.generate_report(detected_faces)
    
    # Save database
    face_system.save_database('campus_face_database.pkl')
    
    print("\n" + "=" * 60)
    print("Face Recognition Processing Complete!")
    print("=" * 60)
