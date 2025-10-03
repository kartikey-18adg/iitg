from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from datetime import datetime
import io
import os

app = Flask(__name__)
CORS(app)

# Import your main system (assuming it's in the same directory)
# from campus_security_system import CampusSecuritySystem

class APIHandler:
    def __init__(self):
        self.current_data = None
        self.analysis_results = None
    
    def process_file(self, file):
        """Process uploaded Excel file"""
        try:
            df = pd.read_excel(file)
            self.current_data = df
            return {
                'success': True,
                'records': len(df),
                'columns': list(df.columns),
                'sample': df.head(5).to_dict('records')
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def run_analysis(self, df):
        """Run complete security analysis"""
        # Placeholder for actual ML analysis
        results = {
            'total_records': len(df),
            'entities': df['student_id'].nunique() if 'student_id' in df.columns else 0,
            'anomalies': int(len(df) * 0.15),  # Simulated
            'alerts': []
        }
        
        # Generate sample alerts
        for i in range(min(5, results['anomalies'])):
            results['alerts'].append({
                'id': f"ALERT_{i+1}",
                'severity': np.random.choice(['HIGH', 'MEDIUM']),
                'timestamp': datetime.now().isoformat(),
                'entity': f"ENT_{np.random.randint(1, 100)}",
                'description': f"Anomaly detected with score -0.{np.random.randint(5, 9)}",
                'location': np.random.choice(['Lab A', 'Library', 'Main Building'])
            })
        
        self.analysis_results = results
        return results

handler = APIHandler()

@app.route('/')
def home():
    return jsonify({
        'message': 'Campus Security Monitoring API',
        'version': '1.0',
        'endpoints': [
            '/api/upload',
            '/api/analyze',
            '/api/results',
            '/api/alerts',
            '/api/export'
        ]
    })

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        return jsonify({'error': 'Invalid file format'}), 400
    
    result = handler.process_file(file)
    return jsonify(result)

@app.route('/api/analyze', methods=['POST'])
def analyze_data():
    """Analyze uploaded data"""
    if handler.current_data is None:
        return jsonify({'error': 'No data loaded'}), 400
    
    results = handler.run_analysis(handler.current_data)
    return jsonify(results)

@app.route('/api/results', methods=['GET'])
def get_results():
    """Get analysis results"""
    if handler.analysis_results is None:
        return jsonify({'error': 'No analysis performed yet'}), 404
    
    return jsonify(handler.analysis_results)

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get security alerts"""
    if handler.analysis_results is None:
        return jsonify({'alerts': []})
    
    return jsonify({'alerts': handler.analysis_results.get('alerts', [])})

@app.route('/api/export', methods=['GET'])
def export_results():
    """Export results to Excel"""
    if handler.current_data is None:
        return jsonify({'error': 'No data available'}), 404
    
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        handler.current_data.to_excel(writer, sheet_name='Data', index=False)
        
        if handler.analysis_results:
            alerts_df = pd.DataFrame(handler.analysis_results.get('alerts', []))
            alerts_df.to_excel(writer, sheet_name='Alerts', index=False)
    
    output.seek(0)
    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name='security_report.xlsx'
    )

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get real-time statistics"""
    if handler.current_data is None:
        return jsonify({
            'total_records': 0,
            'entities': 0,
            'locations': 0,
            'activities': 0
        })
    
    df = handler.current_data
    stats = {
        'total_records': len(df),
        'entities': df['student_id'].nunique() if 'student_id' in df.columns else 0,
        'locations': df['building'].nunique() if 'building' in df.columns else 0,
        'activities': df['activity_type'].nunique() if 'activity_type' in df.columns else 0,
        'date_range': {
            'start': df['timestamp'].min().isoformat() if 'timestamp' in df.columns else None,
            'end': df['timestamp'].max().isoformat() if 'timestamp' in df.columns else None
        }
    }
    
    return jsonify(stats)

@app.route('/api/entity/<entity_id>', methods=['GET'])
def get_entity_info(entity_id):
    """Get information about specific entity"""
    if handler.current_data is None:
        return jsonify({'error': 'No data loaded'}), 404
    
    df = handler.current_data
    entity_data = df[df['student_id'] == entity_id]
    
    if len(entity_data) == 0:
        return jsonify({'error': 'Entity not found'}), 404
    
    info = {
        'entity_id': entity_id,
        'total_activities': len(entity_data),
        'locations': entity_data['building'].unique().tolist() if 'building' in df.columns else [],
        'recent_activities': entity_data.tail(10).to_dict('records')
    }
    
    return jsonify(info)

@app.route('/api/search', methods=['POST'])
def search_records():
    """Search records by various criteria"""
    if handler.current_data is None:
        return jsonify({'error': 'No data loaded'}), 404
    
    search_params = request.json
    df = handler.current_data.copy()
    
    # Apply filters
    if 'student_id' in search_params:
        df = df[df['student_id'] == search_params['student_id']]
    
    if 'building' in search_params:
        df = df[df['building'] == search_params['building']]
    
    if 'date_from' in search_params and 'timestamp' in df.columns:
        df = df[df['timestamp'] >= pd.to_datetime(search_params['date_from'])]
    
    if 'date_to' in search_params and 'timestamp' in df.columns:
        df = df[df['timestamp'] <= pd.to_datetime(search_params['date_to'])]
    
    return jsonify({
        'count': len(df),
        'results': df.to_dict('records')
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("Campus Security Monitoring API Server")
    print("=" * 60)
    print("Server starting on http://localhost:5000")
    print("API Documentation: http://localhost:5000")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)