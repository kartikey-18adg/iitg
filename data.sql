CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    user_type ENUM('student', 'staff', 'faculty', 'visitor') DEFAULT 'student',
    department VARCHAR(100),
    enrollment_date DATE,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_id (student_id),
    INDEX idx_status (status)
);

CREATE TABLE access_devices (
    device_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    card_id VARCHAR(50) UNIQUE,
    mac_address VARCHAR(17),
    device_type ENUM('card', 'mobile', 'laptop', 'desktop', 'tablet'),
    ip_address VARCHAR(45),
    is_active BOOLEAN DEFAULT TRUE,
    registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_card_id (card_id),
    INDEX idx_mac_address (mac_address),
    INDEX idx_user_device (user_id, device_type)
);

CREATE TABLE buildings (
    building_id INT PRIMARY KEY AUTO_INCREMENT,
    building_name VARCHAR(100) NOT NULL,
    building_code VARCHAR(10) UNIQUE,
    building_type ENUM('academic', 'residential', 'administrative', 'recreational'),
    address TEXT,
    capacity INT,
    security_level ENUM('low', 'medium', 'high', 'restricted') DEFAULT 'medium',
    operating_hours VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
    activity_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    record_id VARCHAR(20) UNIQUE,
    user_id INT,
    device_id INT,
    building_id INT,
    activity_type ENUM('entry', 'exit', 'card_swipe', 'wifi_login', 'lab_access', 'library_checkin'),
    timestamp TIMESTAMP NOT NULL,
    duration_minutes INT,
    access_granted BOOLEAN DEFAULT TRUE,
    entry_point VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (device_id) REFERENCES access_devices(device_id),
    FOREIGN KEY (building_id) REFERENCES buildings(building_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_activity (user_id, timestamp),
    INDEX idx_building_activity (building_id, timestamp),
    INDEX idx_activity_type (activity_type)
);

CREATE TABLE entity_clusters (
    cluster_id INT PRIMARY KEY AUTO_INCREMENT,
    cluster_name VARCHAR(50),
    primary_user_id INT,
    confidence_score DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (primary_user_id) REFERENCES users(user_id)
);

CREATE TABLE entity_mappings (
    mapping_id INT PRIMARY KEY AUTO_INCREMENT,
    cluster_id INT,
    user_id INT,
    device_id INT,
    mapping_confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cluster_id) REFERENCES entity_clusters(cluster_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (device_id) REFERENCES access_devices(device_id),
    INDEX idx_cluster (cluster_id),
    INDEX idx_user_mapping (user_id)
);

CREATE TABLE anomalies (
    anomaly_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    activity_id BIGINT,
    user_id INT,
    anomaly_type VARCHAR(50),
    anomaly_score DECIMAL(6,4),
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    description TEXT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    resolved_by INT,
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_severity (severity, resolved),
    INDEX idx_detected (detected_at),
    INDEX idx_user_anomaly (user_id, detected_at)
);

CREATE TABLE security_alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    anomaly_id BIGINT,
    alert_code VARCHAR(20) UNIQUE,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    title VARCHAR(200),
    description TEXT,
    status ENUM('pending', 'investigating', 'resolved', 'false_positive') DEFAULT 'pending',
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP NULL,
    resolved_at TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (anomaly_id) REFERENCES anomalies(anomaly_id),
    INDEX idx_status (status, priority),
    INDEX idx_created (created_at)
);

CREATE TABLE predictions (
    prediction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    activity_id BIGINT,
    field_name VARCHAR(50),
    predicted_value TEXT,
    confidence_score DECIMAL(5,4),
    model_version VARCHAR(20),
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    actual_value TEXT,
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id),
    INDEX idx_activity (activity_id),
    INDEX idx_field (field_name)
);

CREATE TABLE audit_logs (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100),
    table_name VARCHAR(50),
    record_id BIGINT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_action (user_id, action)
);

CREATE VIEW v_recent_activities AS
SELECT 
    a.activity_id,
    a.record_id,
    a.timestamp,
    u.student_id,
    u.first_name,
    u.last_name,
    b.building_name,
    a.activity_type,
    a.duration_minutes,
    a.access_granted
FROM activities a
JOIN users u ON a.user_id = u.user_id
JOIN buildings b ON a.building_id = b.building_id
WHERE a.timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY a.timestamp DESC;

CREATE VIEW v_active_alerts AS
SELECT 
    sa.alert_id,
    sa.alert_code,
    sa.priority,
    sa.title,
    sa.status,
    u.student_id,
    u.first_name,
    u.last_name,
    an.anomaly_score,
    an.severity,
    sa.created_at
FROM security_alerts sa
JOIN anomalies an ON sa.anomaly_id = an.anomaly_id
JOIN users u ON an.user_id = u.user_id
WHERE sa.status IN ('pending', 'investigating')
ORDER BY sa.priority DESC, sa.created_at DESC;

CREATE VIEW v_user_activity_summary AS
SELECT 
    u.user_id,
    u.student_id,
    u.first_name,
    u.last_name,
    COUNT(a.activity_id) as total_activities,
    COUNT(DISTINCT a.building_id) as unique_locations,
    COUNT(DISTINCT DATE(a.timestamp)) as active_days,
    MAX(a.timestamp) as last_activity,
    COUNT(CASE WHEN an.anomaly_id IS NOT NULL THEN 1 END) as anomaly_count
FROM users u
LEFT JOIN activities a ON u.user_id = a.user_id
LEFT JOIN anomalies an ON a.activity_id = an.activity_id
WHERE a.timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.user_id, u.student_id, u.first_name, u.last_name;

DELIMITER //

CREATE PROCEDURE sp_get_entity_history(IN p_student_id VARCHAR(20))
BEGIN
    SELECT 
        a.timestamp,
        b.building_name,
        a.activity_type,
        a.duration_minutes,
        a.access_granted,
        CASE 
            WHEN an.anomaly_id IS NOT NULL THEN 'Anomalous'
            ELSE 'Normal'
        END as status
    FROM activities a
    JOIN users u ON a.user_id = u.user_id
    JOIN buildings b ON a.building_id = b.building_id
    LEFT JOIN anomalies an ON a.activity_id = an.activity_id
    WHERE u.student_id = p_student_id
    ORDER BY a.timestamp DESC
    LIMIT 100;
END //

CREATE PROCEDURE sp_anomaly_statistics(IN p_days INT)
BEGIN
    SELECT 
        DATE(detected_at) as date,
        severity,
        COUNT(*) as count,
        AVG(anomaly_score) as avg_score
    FROM anomalies
    WHERE detected_at >= DATE_SUB(NOW(), INTERVAL p_days DAY)
    GROUP BY DATE(detected_at), severity
    ORDER BY date DESC, severity;
END //

DELIMITER ;

CREATE INDEX idx_activity_user_time ON activities(user_id, timestamp DESC);
CREATE INDEX idx_activity_building_time ON activities(building_id, timestamp DESC);
CREATE INDEX idx_anomaly_severity_time ON anomalies(severity, detected_at DESC);
CREATE INDEX idx_alert_status_priority ON security_alerts(status, priority, created_at DESC);

INSERT INTO buildings (building_name, building_code, building_type, security_level) VALUES
('Main Academic Building', 'MAB', 'academic', 'medium'),
('Central Library', 'LIB', 'academic', 'low'),
('Computer Lab A', 'LABA', 'academic', 'high'),
('Student Dormitory A', 'DORMA', 'residential', 'medium'),
('Administrative Building', 'ADMIN', 'administrative', 'high');
