import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.cluster import DBSCAN
import warnings
warnings.filterwarnings('ignore')

class CampusSecuritySystem:
    def __init__(self):
        self.scaler = StandardScaler()
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        self.activity_predictor = RandomForestClassifier(n_estimators=100, random_state=42)
        self.label_encoders = {}
        
    def load_data(self, filepath):
        """Load data from Excel file"""
        try:
            df = pd.read_excel(filepath)
            print(f"Loaded {len(df)} records")
            return df
        except Exception as e:
            print(f"Error loading data: {e}")
            return None
    
    def entity_resolution(self, df):
        """Link identifiers and resolve entities using clustering"""
        # Create feature matrix for entity matching
        features = []
        entity_cols = ['student_id', 'card_id', 'mac_address', 'building', 'timestamp']
        
        for col in entity_cols:
            if col in df.columns:
                if df[col].dtype == 'object':
                    if col not in self.label_encoders:
                        self.label_encoders[col] = LabelEncoder()
                        df[f'{col}_encoded'] = self.label_encoders[col].fit_transform(df[col].astype(str))
                    else:
                        df[f'{col}_encoded'] = self.label_encoders[col].transform(df[col].astype(str))
                    features.append(f'{col}_encoded')
        
        # DBSCAN clustering for entity resolution
        if features:
            X = df[features].values
            clustering = DBSCAN(eps=0.5, min_samples=2).fit(X)
            df['entity_cluster'] = clustering.labels_
        
        return df
    
    def reconstruct_activity_history(self, df):
        """Reconstruct user activity timeline"""
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df = df.sort_values('timestamp')
        
        # Group by entity
        activity_history = {}
        entity_col = 'entity_cluster' if 'entity_cluster' in df.columns else 'student_id'
        
        for entity in df[entity_col].unique():
            entity_data = df[df[entity_col] == entity]
            activity_history[entity] = {
                'total_activities': len(entity_data),
                'locations': entity_data['building'].unique().tolist() if 'building' in df.columns else [],
                'first_activity': entity_data['timestamp'].min() if 'timestamp' in df.columns else None,
                'last_activity': entity_data['timestamp'].max() if 'timestamp' in df.columns else None
            }
        
        return activity_history
    
    def predict_missing_data(self, df):
        """Predict missing values using ML"""
        df_copy = df.copy()
        
        # Identify columns with missing data
        missing_cols = df_copy.columns[df_copy.isnull().any()].tolist()
        
        for col in missing_cols:
            if df_copy[col].dtype in ['int64', 'float64']:
                # Predict numerical data
                train_data = df_copy[df_copy[col].notna()]
                test_data = df_copy[df_copy[col].isna()]
                
                if len(train_data) > 0 and len(test_data) > 0:
                    feature_cols = [c for c in df_copy.columns if c != col and df_copy[c].dtype in ['int64', 'float64']]
                    
                    if feature_cols:
                        X_train = train_data[feature_cols].fillna(0)
                        y_train = train_data[col]
                        X_test = test_data[feature_cols].fillna(0)
                        
                        model = RandomForestClassifier(n_estimators=50, random_state=42)
                        model.fit(X_train, y_train)
                        predictions = model.predict(X_test)
                        
                        df_copy.loc[df_copy[col].isna(), col] = predictions
        
        return df_copy
    
    def detect_anomalies(self, df):
        """Detect anomalous behavior using Isolation Forest"""
        # Select numerical features
        numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        if len(numerical_cols) > 0:
            X = df[numerical_cols].fillna(0)
            X_scaled = self.scaler.fit_transform(X)
            
            # Detect anomalies
            anomaly_labels = self.anomaly_detector.fit_predict(X_scaled)
            df['anomaly_score'] = self.anomaly_detector.decision_function(X_scaled)
            df['is_anomaly'] = anomaly_labels == -1
            
            # Get anomalous records
            anomalies = df[df['is_anomaly'] == True]
            return df, anomalies
        
        return df, pd.DataFrame()
    
    def generate_alerts(self, anomalies, threshold=-0.5):
        """Generate security alerts for anomalies"""
        alerts = []
        
        for idx, row in anomalies.iterrows():
            if row['anomaly_score'] < threshold:
                alert = {
                    'alert_id': f"ALERT_{idx}",
                    'timestamp': row.get('timestamp', 'Unknown'),
                    'entity': row.get('student_id', row.get('entity_cluster', 'Unknown')),
                    'severity': 'HIGH' if row['anomaly_score'] < -0.7 else 'MEDIUM',
                    'anomaly_score': row['anomaly_score'],
                    'description': f"Unusual activity detected with score {row['anomaly_score']:.2f}"
                }
                alerts.append(alert)
        
        return pd.DataFrame(alerts)
    
    def run_full_analysis(self, filepath):
        """Run complete analysis pipeline"""
        print("=" * 50)
        print("CAMPUS SECURITY MONITORING SYSTEM")
        print("=" * 50)
        
        # Load data
        print("\n[1/5] Loading data...")
        df = self.load_data(filepath)
        if df is None:
            return None
        
        # Entity resolution
        print("[2/5] Performing entity resolution...")
        df = self.entity_resolution(df)
        
        # Reconstruct activity
        print("[3/5] Reconstructing activity histories...")
        activity_history = self.reconstruct_activity_history(df)
        
        # Predict missing data
        print("[4/5] Predicting missing data...")
        df = self.predict_missing_data(df)
        
        # Detect anomalies
        print("[5/5] Detecting anomalies...")
        df, anomalies = self.detect_anomalies(df)
        
        # Generate alerts
        alerts = self.generate_alerts(anomalies)
        
        print(f"\n✓ Analysis complete!")
        print(f"  - Total records: {len(df)}")
        print(f"  - Entities identified: {df['entity_cluster'].nunique() if 'entity_cluster' in df.columns else 'N/A'}")
        print(f"  - Anomalies detected: {len(anomalies)}")
        print(f"  - Alerts generated: {len(alerts)}")
        
        return {
            'data': df,
            'activity_history': activity_history,
            'anomalies': anomalies,
            'alerts': alerts
        }

# Example usage
if __name__ == "__main__":
    system = CampusSecuritySystem()
    
    # Replace with your Excel file path
    results = system.run_full_analysis('campus_data.xlsx')
    
    if results:
        # Save results
        results['data'].to_excel('processed_data.xlsx', index=False)
        results['alerts'].to_excel('security_alerts.xlsx', index=False)
        print("\n✓ Results saved to Excel files")