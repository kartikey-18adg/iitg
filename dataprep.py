import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import re

class DataPreparation:
    """Handles data cleaning, preprocessing, and feature engineering"""
    
    def __init__(self):
        self.feature_cols = []
        
    def create_sample_dataset(self, num_records=500):
        """Create sample campus security dataset"""
        np.random.seed(42)
        
        # Generate base data
        student_ids = [f"STU{str(i).zfill(5)}" for i in range(1, 101)]
        card_ids = [f"CARD{str(i).zfill(6)}" for i in range(1, 101)]
        mac_addresses = [self._generate_mac() for _ in range(100)]
        buildings = ['Main Building', 'Library', 'Lab A', 'Lab B', 'Cafeteria', 'Gym', 'Dorm A', 'Dorm B']
        activities = ['Entry', 'Exit', 'Card Swipe', 'WiFi Login', 'Lab Access', 'Library Check-in']
        
        records = []
        start_date = datetime.now() - timedelta(days=30)
        
        for i in range(num_records):
            # Normal pattern: 85% normal, 15% anomalous
            is_anomaly = np.random.random() > 0.85
            
            student_id = np.random.choice(student_ids)
            idx = student_ids.index(student_id)
            
            record = {
                'record_id': f"REC{str(i+1).zfill(6)}",
                'timestamp': start_date + timedelta(
                    days=np.random.randint(0, 30),
                    hours=np.random.randint(6, 23) if not is_anomaly else np.random.randint(0, 24),
                    minutes=np.random.randint(0, 60)
                ),
                'student_id': student_id,
                'card_id': card_ids[idx],
                'mac_address': mac_addresses[idx],
                'building': np.random.choice(buildings),
                'activity_type': np.random.choice(activities),
                'duration_minutes': np.random.randint(5, 240) if not is_anomaly else np.random.randint(1, 600),
                'access_granted': True if not is_anomaly else np.random.choice([True, False]),
                'device_type': np.random.choice(['Mobile', 'Laptop', 'Desktop', 'Tablet']),
                'ip_address': self._generate_ip(),
            }
            
            # Add some missing values randomly
            if np.random.random() > 0.95:
                record['duration_minutes'] = np.nan
            if np.random.random() > 0.98:
                record['device_type'] = np.nan
                
            records.append(record)
        
        df = pd.DataFrame(records)
        return df.sort_values('timestamp').reset_index(drop=True)
    
    def _generate_mac(self):
        """Generate random MAC address"""
        return ":".join([f"{np.random.randint(0, 256):02x}" for _ in range(6)])
    
    def _generate_ip(self):
        """Generate random IP address"""
        return f"192.168.{np.random.randint(1, 255)}.{np.random.randint(1, 255)}"
    
    def clean_data(self, df):
        """Clean and validate data"""
        df_clean = df.copy()
        
        # Remove duplicates
        df_clean = df_clean.drop_duplicates()
        
        # Validate timestamp
        if 'timestamp' in df_clean.columns:
            df_clean['timestamp'] = pd.to_datetime(df_clean['timestamp'], errors='coerce')
            df_clean = df_clean.dropna(subset=['timestamp'])
        
        # Validate student IDs
        if 'student_id' in df_clean.columns:
            df_clean = df_clean[df_clean['student_id'].notna()]
        
        # Clean text fields
        text_cols = df_clean.select_dtypes(include=['object']).columns
        for col in text_cols:
            df_clean[col] = df_clean[col].str.strip()
        
        print(f"Cleaned data: {len(df)} -> {len(df_clean)} records")
        return df_clean
    
    def engineer_features(self, df):
        """Create additional features for ML models"""
        df_feat = df.copy()
        
        # Temporal features
        if 'timestamp' in df_feat.columns:
            df_feat['hour'] = df_feat['timestamp'].dt.hour
            df_feat['day_of_week'] = df_feat['timestamp'].dt.dayofweek
            df_feat['is_weekend'] = df_feat['day_of_week'].isin([5, 6]).astype(int)
            df_feat['is_night'] = ((df_feat['hour'] >= 22) | (df_feat['hour'] <= 6)).astype(int)
            df_feat['is_business_hours'] = ((df_feat['hour'] >= 9) & (df_feat['hour'] <= 17)).astype(int)
        
        # Activity frequency features
        if 'student_id' in df_feat.columns:
            activity_counts = df_feat.groupby('student_id').size()
            df_feat['user_activity_count'] = df_feat['student_id'].map(activity_counts)
        
        if 'building' in df_feat.columns:
            building_counts = df_feat.groupby('building').size()
            df_feat['building_traffic'] = df_feat['building'].map(building_counts)
        
        # Duration features
        if 'duration_minutes' in df_feat.columns:
            df_feat['duration_minutes'] = df_feat['duration_minutes'].fillna(df_feat['duration_minutes'].median())
            df_feat['is_long_duration'] = (df_feat['duration_minutes'] > 180).astype(int)
            df_feat['is_short_duration'] = (df_feat['duration_minutes'] < 10).astype(int)
        
        # Access pattern features
        if 'access_granted' in df_feat.columns:
            df_feat['access_denied'] = (~df_feat['access_granted']).astype(int)
        
        # Location diversity
        if 'student_id' in df_feat.columns and 'building' in df_feat.columns:
            location_diversity = df_feat.groupby('student_id')['building'].nunique()
            df_feat['location_diversity'] = df_feat['student_id'].map(location_diversity)
        
        print(f"Feature engineering complete. Total features: {len(df_feat.columns)}")
        return df_feat
    
    def split_train_test(self, df, test_size=0.2):
        """Split data into training and testing sets"""
        split_idx = int(len(df) * (1 - test_size))
        train_df = df.iloc[:split_idx]
        test_df = df.iloc[split_idx:]
        
        print(f"Train set: {len(train_df)} records")
        print(f"Test set: {len(test_df)} records")
        
        return train_df, test_df
    
    def export_to_excel(self, df, filename='campus_data.xlsx'):
        """Export dataframe to Excel with formatting"""
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Data', index=False)
            
            # Get workbook and worksheet
            workbook = writer.book
            worksheet = writer.sheets['Data']
            
            # Auto-adjust column widths
            for column in worksheet.columns:
                max_length = 0
                column = [cell for cell in column]
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(cell.value)
                    except:
                        pass
                adjusted_width = (max_length + 2)
                worksheet.column_dimensions[column[0].column_letter].width = adjusted_width
        
        print(f"Data exported to {filename}")

# Example usage
if __name__ == "__main__":
    prep = DataPreparation()
    
    # Create sample dataset
    print("Creating sample campus security dataset...")
    df = prep.create_sample_dataset(num_records=500)
    
    # Clean data
    df_clean = prep.clean_data(df)
    
    # Engineer features
    df_features = prep.engineer_features(df_clean)
    
    # Split data
    train_df, test_df = prep.split_train_test(df_features)
    
    # Export to Excel
    prep.export_to_excel(df_features, 'campus_data_prepared.xlsx')
    prep.export_to_excel(train_df, 'campus_train_data.xlsx')
    prep.export_to_excel(test_df, 'campus_test_data.xlsx')
    
    print("\n✓ Data preparation complete!")