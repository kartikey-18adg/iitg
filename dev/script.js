// ============================================
// Campus Security System - JavaScript & Three.js
// ============================================

// Global Variables
let scene, camera, renderer, particles;
let activityChart, anomalyChart, locationChart, trafficChart;
let currentData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;

// ============================================
// Three.js Background Animation
// ============================================

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x667eea,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    camera.position.z = 30;
    
    // Animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// ============================================
// Navigation & Scroll Effects
// ============================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// File Upload Handling
// ============================================

function initFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.getElementById('uploadBox');
    const fileStatus = document.getElementById('fileStatus');
    
    // Click to upload
    uploadBox.addEventListener('click', (e) => {
        if (e.target !== fileInput) {
            fileInput.click();
        }
    });
    
    // File selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });
    
    // Drag and drop
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('dragover');
    });
    
    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('dragover');
    });
    
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });
}

function handleFileSelect(file) {
    const fileStatus = document.getElementById('fileStatus');
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                         'application/vnd.ms-excel', 'text/csv'];
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        fileStatus.innerHTML = `✓ File selected: ${file.name} (${formatFileSize(file.size)})`;
        fileStatus.style.display = 'block';
        fileStatus.style.background = 'rgba(16, 185, 129, 0.1)';
        fileStatus.style.color = '#10b981';
    } else {
        fileStatus.innerHTML = `✗ Invalid file type. Please upload Excel or CSV files.`;
        fileStatus.style.display = 'block';
        fileStatus.style.background = 'rgba(239, 68, 68, 0.1)';
        fileStatus.style.color = '#ef4444';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// Data Generation & Processing
// ============================================

function generateSampleData() {
    const activities = ['Entry', 'Exit', 'Card Swipe', 'WiFi Login', 'Lab Access', 'Library Check-in'];
    const buildings = ['Main Building', 'Library', 'Lab A', 'Lab B', 'Cafeteria', 'Gym', 'Dorm A'];
    const data = [];
    
    for (let i = 0; i < 100; i++) {
        const isAnomaly = Math.random() > 0.85;
        const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        data.push({
            id: `REC${String(i + 1).padStart(6, '0')}`,
            timestamp: timestamp,
            entityId: `ENT_${Math.floor(Math.random() * 30)}`,
            location: buildings[Math.floor(Math.random() * buildings.length)],
            activity: activities[Math.floor(Math.random() * activities.length)],
            score: isAnomaly ? -0.8 - Math.random() * 0.5 : 0.2 + Math.random() * 0.3,
            isAnomaly: isAnomaly,
            duration: Math.floor(Math.random() * 180) + 5
        });
    }
    
    return data.sort((a, b) => b.timestamp - a.timestamp);
}

function useSampleData() {
    showLoading();
    
    setTimeout(() => {
        currentData = generateSampleData();
        filteredData = currentData;
        updateDashboard();
        createCharts();
        updateActivityFeed();
        updateAlertsDisplay();
        renderTable();
        hideLoading();
        
        // Scroll to dashboard
        scrollToSection('dashboard');
    }, 1500);
}

function processData() {
    const fileInput = document.getElementById('fileInput');
    
    if (!fileInput.files[0]) {
        alert('Please select a file first');
        return;
    }
    
    // In production, this would upload to backend
    alert('File upload requires backend integration. Using sample data for demonstration.');
    useSampleData();
}

// ============================================
// Dashboard Updates
// ============================================

function updateDashboard() {
    const anomalies = currentData.filter(d => d.isAnomaly);
    const criticalAlerts = anomalies.filter(a => a.score < -1.0);
    const entities = new Set(currentData.map(d => d.entityId));
    
    // Update stats with animation
    animateCounter('totalRecords', currentData.length);
    animateCounter('entitiesCount', entities.size);
    animateCounter('anomaliesCount', anomalies.length);
    animateCounter('alertsCount', criticalAlerts.length);
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1000;
    const start = parseInt(element.textContent) || 0;
    const increment = (targetValue - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================
// Activity Feed
// ============================================

function updateActivityFeed() {
    const feedContainer = document.getElementById('activityFeed');
    if (!feedContainer) return;
    
    const recentActivities = currentData.slice(0, 10);
    
    feedContainer.innerHTML = recentActivities.map(activity => {
        const iconBg = activity.isAnomaly ? 
            'background: linear-gradient(135deg, #ef4444, #dc2626);' : 
            'background: linear-gradient(135deg, #10b981, #059669);';
        
        return `
            <div class="feed-item">
                <div class="feed-icon" style="${iconBg}">
                    ${activity.isAnomaly ? '⚠️' : '✓'}
                </div>
                <div class="feed-content">
                    <div class="feed-text">
                        <strong>${activity.entityId}</strong> - ${activity.activity} at ${activity.location}
                    </div>
                    <div class="feed-time">${formatTimestamp(activity.timestamp)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function formatTimestamp(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// ============================================
// Charts Creation
// ============================================

function createCharts() {
    createActivityChart();
    createAnomalyChart();
    createLocationChart();
    createTrafficChart();
}

function createActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    const hourly = Array(24).fill(0);
    currentData.forEach(d => {
        const hour = d.timestamp.getHours();
        hourly[hour]++;
    });
    
    if (activityChart) activityChart.destroy();
    
    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Activities per Hour',
                data: hourly,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#edf2f7' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a0aec0' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a0aec0' }
                }
            }
        }
    });
}

function createAnomalyChart() {
    const ctx = document.getElementById('anomalyChart');
    if (!ctx) return;
    
    const normal = currentData.filter(d => !d.isAnomaly).length;
    const anomalies = currentData.filter(d => d.isAnomaly).length;
    
    if (anomalyChart) anomalyChart.destroy();
    
    anomalyChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Normal Activities', 'Anomalies'],
            datasets: [{
                data: [normal, anomalies],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#edf2f7', padding: 20 }
                }
            }
        }
    });
}

function createLocationChart() {
    const ctx = document.getElementById('locationChart');
    if (!ctx) return;
    
    const locationCounts = {};
    currentData.forEach(d => {
        locationCounts[d.location] = (locationCounts[d.location] || 0) + 1;
    });
    
    const labels = Object.keys(locationCounts);
    const data = Object.values(locationCounts);
    
    if (locationChart) locationChart.destroy();
    
    locationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Activities by Location',
                data: data,
                backgroundColor: 'rgba(240, 147, 251, 0.6)',
                borderColor: '#f093fb',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#edf2f7' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a0aec0' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a0aec0', maxRotation: 45, minRotation: 45 }
                }
            }
        }
    });
}

function createTrafficChart() {
    const ctx = document.getElementById('trafficChart');
    if (!ctx) return;
    
    const dayData = Array(7).fill(0);
    currentData.forEach(d => {
        const day = d.timestamp.getDay();
        dayData[day]++;
    });
    
    if (trafficChart) trafficChart.destroy();
    
    trafficChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Weekly Traffic',
                data: dayData,
                borderColor: '#4facfe',
                backgroundColor: 'rgba(79, 172, 254, 0.2)',
                pointBackgroundColor: '#4facfe',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4facfe'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#edf2f7' }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a0aec0', backdropColor: 'transparent' },
                    pointLabels: { color: '#edf2f7' }
                }
            }
        }
    });
}

// ============================================
// Alerts Display
// ============================================

function updateAlertsDisplay() {
    const alertsContainer = document.getElementById('alertsContainer');
    if (!alertsContainer) return;
    
    const anomalies = currentData.filter(d => d.isAnomaly).slice(0, 10);
    
    if (anomalies.length === 0) {
        alertsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #10b981;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">✓</div>
                <h3>No Active Alerts</h3>
                <p>All systems operating normally</p>
            </div>
        `;
        return;
    }
    
    alertsContainer.innerHTML = anomalies.map((alert, idx) => {
        let severity, badgeClass, badgeStyle;
        if (alert.score < -1.0) {
            severity = 'CRITICAL';
            badgeClass = 'alert-critical';
            badgeStyle = 'background: #ef4444; color: white;';
        } else if (alert.score < -0.7) {
            severity = 'HIGH';
            badgeClass = 'alert-high';
            badgeStyle = 'background: #f59e0b; color: white;';
        } else {
            severity = 'MEDIUM';
            badgeClass = 'alert-medium';
            badgeStyle = 'background: #3b82f6; color: white;';
        }
        
        return `
            <div class="alert-item ${badgeClass}">
                <div class="alert-header">
                    <div class="alert-title">ALERT #${idx + 1} - ${severity} PRIORITY</div>
                    <span class="alert-badge" style="${badgeStyle}">
                        ${severity}
                    </span>
                </div>
                <div class="alert-description">
                    <strong>Entity:</strong> ${alert.entityId} | 
                    <strong>Location:</strong> ${alert.location} | 
                    <strong>Activity:</strong> ${alert.activity}<br>
                    <strong>Time:</strong> ${alert.timestamp.toLocaleString()} | 
                    <strong>Score:</strong> ${alert.score.toFixed(2)} | 
                    <strong>Duration:</strong> ${alert.duration}s
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// Table Rendering & Pagination
// ============================================

function renderTable() {
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #a0aec0;">
                    No data available
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = pageData.map(item => {
        const statusClass = item.isAnomaly ? 'anomaly' : 'normal';
        const statusText = item.isAnomaly ? 'Anomaly' : 'Normal';
        const statusIcon = item.isAnomaly ? '⚠' : '✓';
        
        return `
            <tr>
                <td>
                    <span class="status-badge ${statusClass}">
                        <span class="status-indicator"></span>
                        ${statusIcon} ${statusText}
                    </span>
                </td>
                <td>${item.timestamp.toLocaleString()}</td>
                <td>${item.entityId}</td>
                <td>${item.location}</td>
                <td>${item.activity}</td>
                <td>${item.score.toFixed(2)}</td>
                <td>
                    <button class="action-btn" onclick="viewDetails('${item.id}')">View</button>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagination();
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ← Previous
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span style="padding: 0.75rem;">...</span>';
        }
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next →
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
    
    // Scroll to table
    document.querySelector('.data-table').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// Search & Filter
// ============================================

function initSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            applyFilters();
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            applyFilters();
        });
    }
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const filterValue = filterSelect ? filterSelect.value : 'all';
    
    filteredData = currentData.filter(item => {
        // Apply search filter
        const matchesSearch = !searchTerm || 
            item.entityId.toLowerCase().includes(searchTerm) ||
            item.location.toLowerCase().includes(searchTerm) ||
            item.activity.toLowerCase().includes(searchTerm);
        
        // Apply status filter
        let matchesFilter = true;
        if (filterValue === 'normal') {
            matchesFilter = !item.isAnomaly;
        } else if (filterValue === 'anomaly') {
            matchesFilter = item.isAnomaly;
        }
        
        return matchesSearch && matchesFilter;
    });
    
    currentPage = 1;
    renderTable();
}

// ============================================
// Export Results
// ============================================

function exportResults() {
    if (currentData.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Convert data to CSV
    const headers = ['ID', 'Timestamp', 'Entity ID', 'Location', 'Activity', 'Score', 'Status', 'Duration'];
    const csvContent = [
        headers.join(','),
        ...currentData.map(item => [
            item.id,
            item.timestamp.toISOString(),
            item.entityId,
            item.location,
            item.activity,
            item.score.toFixed(2),
            item.isAnomaly ? 'Anomaly' : 'Normal',
            item.duration
        ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `campus_security_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ============================================
// View Details
// ============================================

function viewDetails(recordId) {
    const record = currentData.find(item => item.id === recordId);
    if (!record) return;
    
    const detailsHTML = `
        <strong>Record ID:</strong> ${record.id}
        <strong>Timestamp:</strong> ${record.timestamp.toLocaleString()}
        <strong>Entity ID:</strong> ${record.entityId}
        <strong>Location:</strong> ${record.location}
        <strong>Activity:</strong> ${record.activity}
        <strong>Anomaly Score:</strong> ${record.score.toFixed(2)}
        <strong>Status:</strong> ${record.isAnomaly ? 'Anomaly Detected' : 'Normal Activity'}
        <strong>Duration:</strong> ${record.duration} seconds
    `;
    
    alert(detailsHTML.replace(/<strong>/g, '\n').replace(/<\/strong>/g, ': '));
}

// ============================================
// Loading Overlay
// ============================================

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ============================================
// Initialize Application
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js background
    initThreeJS();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize file upload
    initFileUpload();
    
    // Initialize search and filter
    initSearchAndFilter();
    
    // Add smooth scroll to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    console.log('Campus Security Monitoring System initialized successfully!');
});

// ============================================
// Auto-refresh Activity Feed (Optional)
// ============================================

// Uncomment to enable auto-refresh every 30 seconds
/*
setInterval(() => {
    if (currentData.length > 0) {
        updateActivityFeed();
    }
}, 30000);
*/
// ============================================
// Facial Recognition Processing
// ============================================

let faceRecognitionData = [];
let faceDatabase = {};

function initFaceUpload() {
    const videoFileInput = document.getElementById('videoFileInput');
    const videoUploadBox = document.getElementById('videoUploadBox');
    const videoFileStatus = document.getElementById('videoFileStatus');
    
    // File selection
    videoFileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleVideoFileSelect(files);
        }
    });
    
    // Drag and drop
    videoUploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        videoUploadBox.classList.add('dragover');
    });
    
    videoUploadBox.addEventListener('dragleave', () => {
        videoUploadBox.classList.remove('dragover');
    });
    
    videoUploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        videoUploadBox.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleVideoFileSelect(files);
        }
    });
}

function handleVideoFileSelect(files) {
    const videoFileStatus = document.getElementById('videoFileStatus');
    const allowedVideo = ['video/mp4', 'video/avi', 'video/quicktime'];
    const allowedImage = ['image/jpeg', 'image/png', 'image/jpg'];
    
    let validFiles = 0;
    let totalSize = 0;
    
    for (let file of files) {
        if (allowedVideo.includes(file.type) || allowedImage.includes(file.type)) {
            validFiles++;
            totalSize += file.size;
        }
    }
    
    if (validFiles > 0) {
        videoFileStatus.innerHTML = `✓ ${validFiles} file(s) selected (${formatFileSize(totalSize)})`;
        videoFileStatus.style.display = 'block';
        videoFileStatus.style.background = 'rgba(16, 185, 129, 0.1)';
        videoFileStatus.style.color = '#10b981';
    } else {
        videoFileStatus.innerHTML = `✗ No valid video/image files selected`;
        videoFileStatus.style.display = 'block';
        videoFileStatus.style.background = 'rgba(239, 68, 68, 0.1)';
        videoFileStatus.style.color = '#ef4444';
    }
}

async function processFacialRecognition() {
    const videoFileInput = document.getElementById('videoFileInput');
    
    if (!videoFileInput.files || videoFileInput.files.length === 0) {
        alert('Please select video or image files first');
        return;
    }
    
    showLoading();
    
    // Create FormData for file upload
    const formData = new FormData();
    for (let file of videoFileInput.files) {
        formData.append('files', file);
    }
    
    try {
        // Send to backend API
        const response = await fetch('http://localhost:5000/api/face-recognition/process', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const results = await response.json();
            faceRecognitionData = results.faces || [];
            updateFaceRecognitionResults(results);
            scrollToSection('face-results');
        } else {
            throw new Error('Face recognition processing failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Face recognition requires backend server. Using demo data...');
        // Use demo data
        useDemoFaceData();
    } finally {
        hideLoading();
    }
}

function useDemoFaceData() {
    // Generate demo face recognition data
    faceRecognitionData = [];
    const persons = ['STU00001', 'STU00002', 'STU00003', 'Unknown', 'STU00005'];
    
    for (let i = 0; i < 20; i++) {
        const isIdentified = Math.random() > 0.3;
        faceRecognitionData.push({
            face_id: `FACE_${i + 1}`,
            person_id: isIdentified ? persons[Math.floor(Math.random() * 4)] : 'Unknown',
            confidence: isIdentified ? 0.7 + Math.random() * 0.25 : 0.3 + Math.random() * 0.3,
            timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
            frame_number: Math.floor(Math.random() * 1000),
            identified: isIdentified
        });
    }
    
    updateFaceRecognitionResults({
        total_faces: faceRecognitionData.length,
        identified: faceRecognitionData.filter(f => f.identified).length,
        unknown: faceRecognitionData.filter(f => !f.identified).length,
        faces: faceRecognitionData
    });
    
    scrollToSection('face-results');
}

function updateFaceRecognitionResults(results) {
    // Update statistics
    document.getElementById('detectedFacesCount').textContent = results.total_faces || 0;
    document.getElementById('identifiedPersonsCount').textContent = results.identified || 0;
    document.getElementById('unknownFacesCount').textContent = results.unknown || 0;
    
    const avgConf = results.faces && results.faces.length > 0
        ? (results.faces.reduce((sum, f) => sum + f.confidence, 0) / results.faces.length * 100).toFixed(1)
        : 0;
    document.getElementById('avgConfidence').textContent = avgConf + '%';
    
    // Render face gallery
    renderFaceGallery(results.faces || []);
}

function renderFaceGallery(faces) {
    const gallery = document.getElementById('faceGallery');
    
    if (faces.length === 0) {
        gallery.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No faces detected</p>';
        return;
    }
    
    gallery.innerHTML = faces.map(face => {
        const statusClass = face.identified ? 'identified' : 'unknown';
        const statusText = face.identified ? 'Identified' : 'Unknown';
        const confidencePercent = (face.confidence * 100).toFixed(1);
        
        return `
            <div class="face-card">
                <div class="face-image" style="background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                    👤
                </div>
                <div class="face-info">
                    <div class="person-id">${face.person_id}</div>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <div class="confidence-score">
                        <span>Confidence:</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${confidencePercent}%"></div>
                        </div>
                        <span>${confidencePercent}%</span>
                    </div>
                    <div class="face-timestamp">Frame: ${face.frame_number} | ${new Date(face.timestamp).toLocaleString()}</div>
                </div>
            </div>
        `;
    }).join('');
}

async function addPersonToDatabase() {
    const personId = document.getElementById('personId').value;
    const personImagesInput = document.getElementById('personImagesInput');
    
    if (!personId) {
        alert('Please enter a Person ID');
        return;
    }
    
    if (!personImagesInput.files || personImagesInput.files.length === 0) {
        alert('Please select at least one image');
        return;
    }
    
    showLoading();
    
    const formData = new FormData();
    formData.append('person_id', personId);
    for (let file of personImagesInput.files) {
        formData.append('images', file);
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/face-database/add-person', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`Successfully added ${result.embeddings_count} images for ${personId}`);
            
            // Clear inputs
            document.getElementById('personId').value = '';
            personImagesInput.value = '';
        } else {
            throw new Error('Failed to add person to database');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Database update requires backend server. Simulating success...');
        document.getElementById('personId').value = '';
        personImagesInput.value = '';
    } finally {
        hideLoading();
    }
}

async function detectDuplicates() {
    showLoading();
    
    try {
        const response = await fetch('http://localhost:5000/api/face-database/detect-duplicates', {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            displayDuplicateResults(result.duplicates || []);
        } else {
            throw new Error('Duplicate detection failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Duplicate detection requires backend server.');
    } finally {
        hideLoading();
    }
}

function displayDuplicateResults(duplicates) {
    if (duplicates.length === 0) {
        alert('No duplicates found in the database');
        return;
    }
    
    let message = `Found ${duplicates.length} potential duplicate(s):\n\n`;
    duplicates.forEach((dup, idx) => {
        message += `${idx + 1}. ${dup.person1} ↔ ${dup.person2} (Similarity: ${(dup.similarity * 100).toFixed(1)}%)\n`;
    });
    
    alert(message);
}

function exportFaceResults() {
    if (faceRecognitionData.length === 0) {
        alert('No face recognition data to export');
        return;
    }
    
    // Convert to CSV
    const headers = ['Face ID', 'Person ID', 'Confidence', 'Status', 'Frame Number', 'Timestamp'];
    const csvContent = [
        headers.join(','),
        ...faceRecognitionData.map(face => [
            face.face_id,
            face.person_id,
            face.confidence.toFixed(4),
            face.identified ? 'Identified' : 'Unknown',
            face.frame_number,
            face.timestamp
        ].join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `face_recognition_results_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Update DOMContentLoaded to include face recognition initialization
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initializations ...
    
    // Initialize face recognition upload
    initFaceUpload();
});
