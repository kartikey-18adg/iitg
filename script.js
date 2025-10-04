// ============================================
// Enhanced JavaScript with Three.js Animations
// Campus Security Monitoring System
// ============================================

// Global Variables
let scene, camera, renderer, particles, stars;
let activityChart, anomalyChart, locationChart, trafficChart;
let currentData = [];
let animationId;

// ============================================
// Initialize Everything on Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initNavigation();
    initFileUpload();
    initScrollAnimations();
    initTiltEffect();
    animateCounters();
    
    // Load sample data after a delay
    setTimeout(() => {
        useSampleData();
    }, 1000);
});

// ============================================
// Three.js Background Animation
// ============================================

function initThreeJS() {
    const container = document.getElementById('three-background');
    if (!container) return;
    
    // Scene Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f0f1e, 0.002);
    
    // Camera Setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;
    
    // Renderer Setup
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create Particle System
    createParticleSystem();
    
    // Create Star Field
    createStarField();
    
    // Create Geometric Shapes
    createFloatingGeometry();
    
    // Start Animation Loop
    animateThreeJS();
    
    // Handle Window Resize
    window.addEventListener('resize', onWindowResize);
}

function createParticleSystem() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 200;
        posArray[i + 1] = (Math.random() - 0.5) * 200;
        posArray[i + 2] = (Math.random() - 0.5) * 200;
        
        // Colors (gradient from primary to accent)
        const t = Math.random();
        colorArray[i] = 0.4 + t * 0.2;     // R
        colorArray[i + 1] = 0.5 + t * 0.3; // G
        colorArray[i + 2] = 0.9 + t * 0.1; // B
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i++) {
        starPositions[i] = (Math.random() - 0.5) * 300;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.3,
        transparent: true,
        opacity: 0.6
    });
    
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function createFloatingGeometry() {
    // Create glowing torus
    const torusGeometry = new THREE.TorusGeometry(10, 2, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0x667eea,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-30, 20, -50);
    scene.add(torus);
    torus.userData = { rotationSpeed: { x: 0.001, y: 0.002 } };
    
    // Create glowing sphere
    const sphereGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xf093fb,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(40, -20, -60);
    scene.add(sphere);
    sphere.userData = { rotationSpeed: { x: 0.002, y: 0.001 } };
    
    // Store references for animation
    scene.userData.geometries = [torus, sphere];
}

function animateThreeJS() {
    animationId = requestAnimationFrame(animateThreeJS);
    
    const time = Date.now() * 0.0001;
    
    // Rotate particles
    if (particles) {
        particles.rotation.x += 0.0002;
        particles.rotation.y += 0.0003;
    }
    
    // Rotate stars slowly
    if (stars) {
        stars.rotation.x += 0.0001;
        stars.rotation.y += 0.0002;
    }
    
    // Animate geometric shapes
    if (scene.userData.geometries) {
        scene.userData.geometries.forEach(geom => {
            geom.rotation.x += geom.userData.rotationSpeed.x;
            geom.rotation.y += geom.userData.rotationSpeed.y;
            geom.position.y += Math.sin(time + geom.position.x) * 0.01;
        });
    }
    
    // Mouse parallax effect
    if (window.mouseX !== undefined && window.mouseY !== undefined) {
        camera.position.x += (window.mouseX * 0.05 - camera.position.x) * 0.05;
        camera.position.y += (-window.mouseY * 0.05 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse move for parallax effect
document.addEventListener('mousemove', (event) => {
    window.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    window.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// ============================================
// Navigation & Scroll Effects
// ============================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// Scroll Animations
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// 3D Tilt Effect for Floating Cards
// ============================================

function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mouseenter', handleTiltEnter);
        element.addEventListener('mousemove', handleTiltMove);
        element.addEventListener('mouseleave', handleTiltLeave);
    });
}

function handleTiltEnter(e) {
    this.style.transition = 'none';
}

function handleTiltMove(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
}

function handleTiltLeave(e) {
    this.style.transition = 'transform 0.5s ease';
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
}

// ============================================
// Animated Counter
// ============================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-value[data-target]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================
// File Upload Handling
// ============================================

function initFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.getElementById('dataUploadBox');
    const cctvInput = document.getElementById('cctvInput');
    const cctvUploadArea = document.getElementById('cctvUploadArea');
    
    // Data file upload
    if (fileInput && uploadBox) {
        uploadBox.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleDataFile(file);
        });
        
        // Drag and drop
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#667eea';
            uploadBox.style.background = 'rgba(102, 126, 234, 0.1)';
        });
        
        uploadBox.addEventListener('dragleave', () => {
            uploadBox.style.borderColor = '';
            uploadBox.style.background = '';
        });
        
        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '';
            uploadBox.style.background = '';
            const file = e.dataTransfer.files[0];
            if (file) handleDataFile(file);
        });
    }
    
    // CCTV upload
    if (cctvInput && cctvUploadArea) {
        cctvUploadArea.addEventListener('click', () => cctvInput.click());
        
        cctvInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleCCTVFile(file);
        });
    }
}

function handleDataFile(file) {
    const fileInfo = document.getElementById('fileInfo');
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
    ];
    
    if (allowedTypes.includes(file.type)) {
        if (fileInfo) {
            fileInfo.innerHTML = `
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: 10px; color: #10b981;">
                    ✓ ${file.name} (${formatFileSize(file.size)})
                </div>
            `;
        }
    } else {
        if (fileInfo) {
            fileInfo.innerHTML = `
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 10px; color: #ef4444;">
                    ✗ Invalid file type
                </div>
            `;
        }
    }
}

function handleCCTVFile(file) {
    showLoading();
    setTimeout(() => {
        hideLoading();
        alert(`CCTV file "${file.name}" uploaded successfully!\n\nAI Face Detection processing started...`);
    }, 2000);
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
    const buildings = ['Main Building', 'Library', 'Lab A', 'Lab B', 'Cafeteria', 'Gym', 'Dorm A', 'Dorm B'];
    const data = [];
    
    for (let i = 0; i < 150; i++) {
        const isAnomaly = Math.random() > 0.85;
        const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        data.push({
            id: `REC${String(i + 1).padStart(6, '0')}`,
            timestamp: timestamp,
            entityId: `ENT_${String(Math.floor(Math.random() * 50)).padStart(3, '0')}`,
            location: buildings[Math.floor(Math.random() * buildings.length)],
            activity: activities[Math.floor(Math.random() * activities.length)],
            score: isAnomaly ? -0.8 - Math.random() * 0.6 : 0.2 + Math.random() * 0.3,
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
        updateDashboard();
        createCharts();
        updateActivityFeed();
        renderTable();
        hideLoading();
        
        // Smooth scroll to dashboard
        setTimeout(() => scrollToSection('dashboard'), 500);
    }, 1500);
}

function processData() {
    const fileInput = document.getElementById('fileInput');
    
    if (!fileInput.files[0]) {
        alert('⚠️ Please select a file first');
        return;
    }
    
    // In production, upload to backend
    alert('📤 File upload requires backend integration.\n\n Using sample data for demonstration.');
    useSampleData();
}

function exportResults() {
    if (currentData.length === 0) {
        alert('⚠️ No data to export. Please analyze data first.');
        return;
    }
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        alert('✓ Results exported successfully!\n\nFile: campus_security_report.xlsx');
    }, 1000);
}

// ============================================
// Dashboard Updates
// ============================================

function updateDashboard() {
    const anomalies = currentData.filter(d => d.isAnomaly);
    const criticalAlerts = anomalies.filter(a => a.score < -1.0);
    const entities = new Set(currentData.map(d => d.entityId));
    
    // Update with animation
    animateStatValue('totalRecords', currentData.length);
    animateStatValue('entitiesCount', entities.size);
    animateStatValue('anomaliesCount', anomalies.length);
    animateStatValue('alertsCount', criticalAlerts.length);
}

function animateStatValue(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1500;
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
    
    const recentActivities = currentData.slice(0, 15);
    
    feedContainer.innerHTML = recentActivities.map(activity => {
        const iconBg = activity.isAnomaly ? 
            'background: linear-gradient(135deg, #ef4444, #dc2626);' : 
            'background: linear-gradient(135deg, #10b981, #059669);';
        
        return `
            <div class="activity-item" style="animation: slideInLeft 0.5s ease-out;">
                <div style="width: 50px; height: 50px; border-radius: 12px; ${iconBg} display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                    ${activity.isAnomaly ? '⚠️' : '✓'}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">
                        ${activity.entityId} - ${activity.activity}
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-muted);">
                        ${activity.location} • ${formatTimestamp(activity.timestamp)}
                    </div>
                </div>
                <div style="font-size: 0.85rem; padding: 0.5rem 1rem; background: ${activity.isAnomaly ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; border-radius: 20px; color: ${activity.isAnomaly ? '#ef4444' : '#10b981'}; font-weight: 600;">
                    ${activity.score.toFixed(3)}
                </div>
            </div>
        `;
    }).join('');
}

function refreshFeed() {
    const btn = document.querySelector('.btn-refresh .refresh-icon');
    if (btn) {
        btn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            btn.style.transform = 'rotate(0deg)';
        }, 500);
    }
    updateActivityFeed();
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
    
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.4)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.0)');
    
    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Activities',
                data: hourly,
                borderColor: '#667eea',
                backgroundColor: gradient,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { 
                        color: '#edf2f7',
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 15, 30, 0.9)',
                    titleColor: '#edf2f7',
                    bodyColor: '#edf2f7',
                    borderColor: '#667eea',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
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
                borderWidth: 0,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { 
                        color: '#edf2f7',
                        padding: 20,
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 15, 30, 0.9)',
                    titleColor: '#edf2f7',
                    bodyColor: '#edf2f7'
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
                label: 'Activities',
                data: data,
                backgroundColor: 'rgba(240, 147, 251, 0.6)',
                borderColor: '#f093fb',
                borderWidth: 2,
                borderRadius: 8
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
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' },
                    beginAtZero: true
                },
                x: {
                    grid: { display: false },
                    ticks: { 
                        color: '#94a3b8',
                        maxRotation: 45,
                        minRotation: 45
                    }
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
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
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
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { 
                        color: '#94a3b8',
                        backdropColor: 'transparent'
                    },
                    pointLabels: { color: '#edf2f7' },
                    beginAtZero: true
                }
            }
        }
    });
}

// ============================================
// Table Rendering
// ============================================

function renderTable() {
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;
    
    const displayData = currentData.slice(0, 20);
    
    tableBody.innerHTML = displayData.map(row => {
        const statusClass = row.isAnomaly ? 'anomaly' : 'normal';
        const statusColor = row.isAnomaly ? '#ef4444' : '#10b981';
        
        return `
            <tr style="animation: fadeIn 0.5s ease-out;">
                <td>
                    <span class="status-badge ${statusClass}">
                        <span class="status-indicator"></span>
                        ${row.isAnomaly ? 'Anomaly' : 'Normal'}
                    </span>
                </td>
                <td>${row.timestamp.toLocaleString()}</td>
                <td><strong>${row.entityId}</strong></td>
                <td>${row.location}</td>
                <td>${row.activity}</td>
                <td style="color: ${statusColor}; font-weight: 600;">${row.score.toFixed(3)}</td>
                <td>
                    <button class="action-btn" onclick="viewDetails('${row.id}')">
                        View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewDetails(id) {
    const record = currentData.find(r => r.id === id);
    if (record) {
        alert(`
📋 Activity Details

ID: ${record.id}
Entity: ${record.entityId}
Location: ${record.location}
Activity: ${record.activity}
Timestamp: ${record.timestamp.toLocaleString()}
Duration: ${record.duration} minutes
Score: ${record.score.toFixed(3)}
Status: ${record.isAnomaly ? 'ANOMALY' : 'NORMAL'}
        `);
    }
}

// Search and Filter functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterTable(e.target.value, filterSelect?.value || 'all');
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterTable(searchInput?.value || '', e.target.value);
        });
    }
});

function filterTable(searchTerm, filterType) {
    let filtered = currentData;
    
    // Apply filter
    if (filterType === 'normal') {
        filtered = filtered.filter(d => !d.isAnomaly);
    } else if (filterType === 'anomaly') {
        filtered = filtered.filter(d => d.isAnomaly);
    }
    
    // Apply search
    if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(d => 
            d.entityId.toLowerCase().includes(searchTerm) ||
            d.location.toLowerCase().includes(searchTerm) ||
            d.activity.toLowerCase().includes(searchTerm)
        );
    }
    
    renderFilteredTable(filtered);
}

function renderFilteredTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;
    
    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    No results found
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = data.slice(0, 20).map(row => {
        const statusClass = row.isAnomaly ? 'anomaly' : 'normal';
        const statusColor = row.isAnomaly ? '#ef4444' : '#10b981';
        
        return `
            <tr style="animation: fadeIn 0.5s ease-out;">
                <td>
                    <span class="status-badge ${statusClass}">
                        <span class="status-indicator"></span>
                        ${row.isAnomaly ? 'Anomaly' : 'Normal'}
                    </span>
                </td>
                <td>${row.timestamp.toLocaleString()}</td>
                <td><strong>${row.entityId}</strong></td>
                <td>${row.location}</td>
                <td>${row.activity}</td>
                <td style="color: ${statusColor}; font-weight: 600;">${row.score.toFixed(3)}</td>
                <td>
                    <button class="action-btn" onclick="viewDetails('${row.id}')">
                        View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
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
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }
    
    // Ctrl/Cmd + U: Trigger upload
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.click();
    }
    
    // Ctrl/Cmd + R: Refresh data
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshFeed();
    }
});

// ============================================
// Smooth Scroll for All Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Intersection Observer for Fade-in Animations
// ============================================

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all stat cards and chart cards
document.querySelectorAll('.stat-card, .chart-card, .activity-feed-container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

// ============================================
// Add Particle Effect on Button Click
// ============================================

document.querySelectorAll('.btn-action').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'ripple-effect 0.6s ease-out';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Performance Monitoring
// ============================================

if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`🚀 Page Load Time: ${pageLoadTime}ms`);
        }, 0);
    });
}

// ============================================
// Detect Reduced Motion Preference
// ============================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// ============================================
// Add Gradient Animation to Hero Text
// ============================================

function animateGradient() {
    const gradientTexts = document.querySelectorAll('.gradient-text');
    let hue = 0;
    
    setInterval(() => {
        hue = (hue + 1) % 360;
        gradientTexts.forEach(text => {
            text.style.backgroundImage = `linear-gradient(135deg, 
                hsl(${hue}, 70%, 60%), 
                hsl(${(hue + 60) % 360}, 70%, 70%))`;
        });
    }, 50);
}

// Uncomment to enable gradient animation
// animateGradient();

// ============================================
// Easter Egg: Konami Code
// ============================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        triggerEasterEgg();
        konamiCode = [];
    }
});

function triggerEasterEgg() {
    // Add rainbow effect to particles
    if (particles) {
        const colors = [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x9400d3];
        let colorIndex = 0;
        
        const interval = setInterval(() => {
            particles.material.color.setHex(colors[colorIndex]);
            colorIndex = (colorIndex + 1) % colors.length;
        }, 200);
        
        setTimeout(() => {
            clearInterval(interval);
            particles.material.color.setHex(0x667eea);
        }, 5000);
    }
    
    // Show celebration message
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.padding = '2rem 4rem';
    message.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    message.style.borderRadius = '20px';
    message.style.color = 'white';
    message.style.fontSize = '2rem';
    message.style.fontWeight = '800';
    message.style.zIndex = '10000';
    message.style.animation = 'fadeIn 0.5s ease-out';
    message.textContent = '🎉 You found the Easter Egg! 🎉';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => message.remove(), 500);
    }, 3000);
}

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(fadeOutStyle);

// ============================================
// Cleanup on Page Unload
// ============================================

window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Destroy charts
    [activityChart, anomalyChart, locationChart, trafficChart].forEach(chart => {
        if (chart) chart.destroy();
    });
    
    // Cleanup Three.js
    if (scene) {
        scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
    
    if (renderer) {
        renderer.dispose();
    }
});

// ============================================
// Console Welcome Message
// ============================================

console.log(`
%c
   ___                            ___                   _ _       
  / __\\__ _ _ __ ___  _ __  _   _/ __\\ ___  ___ _   _ (_) |_ _   _ 
 / /  / _\` | '_ \` _ \\| '_ \\| | | \\__ \\/ _ \\/ __| | | || | __| | | |
/ /__| (_| | | | | | | |_) | |_| |___/  __/ (__| |_| || | |_| |_| |
\\____/\\__,_|_| |_| |_| .__/ \\__,_|    \\___|\\___|\\__,_|/ |\\__|\\__, |
                     |_|                             |__/     |___/ 
                     
%cWelcome to Campus Security Monitoring System! 🛡️
%cVersion: 1.0.0 | Made with ❤️ for IITG

%cKeyboard Shortcuts:
• Ctrl/Cmd + K: Focus Search
• Ctrl/Cmd + U: Upload File
• Ctrl/Cmd + R: Refresh Data

%cDeveloper Tools Detected!
If you're interested in the code, check out our GitHub repo.
`, 
'color: #667eea; font-size: 12px; font-family: monospace;',
'color: #f093fb; font-size: 16px; font-weight: bold;',
'color: #94a3b8; font-size: 12px;',
'color: #10b981; font-size: 12px;',
'color: #f59e0b; font-size: 12px;'
);

// ============================================
// Initialize Everything
// ============================================

console.log('✓ Campus Security System initialized successfully!');
console.log('📊 Dashboard ready');
console.log('🎨 Three.js animations running');
console.log('📈 Charts engine loaded');