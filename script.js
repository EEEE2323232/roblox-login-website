// Roblox Login Website JavaScript

// Background images for the gaming grid
const backgroundImages = [
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1624571409104-c7c9e0e7a3a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
];

// User storage (simulated database)
let users = JSON.parse(localStorage.getItem('robloxUsers') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    createBackgroundGrid();
    setupLoginForm();
    checkExistingLogin();
});

// Create dynamic background grid
function createBackgroundGrid() {
    const grid = document.getElementById('backgroundGrid');
    const numItems = 48; // 12 columns x 4 rows
    
    for (let i = 0; i < numItems; i++) {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.style.backgroundImage = `url(${backgroundImages[i % backgroundImages.length]})`;
        grid.appendChild(item);
    }
    
    // Animate background items
    animateBackground();
}

// Animate background grid items
function animateBackground() {
    const items = document.querySelectorAll('.grid-item');
    let currentIndex = 0;
    
    setInterval(() => {
        items.forEach((item, index) => {
            item.style.opacity = index === currentIndex ? '0.3' : '0.1';
        });
        currentIndex = (currentIndex + 1) % items.length;
    }, 3000);
}

// Setup login form functionality
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            showNotification('Please enter both username and password', 'error');
            return;
        }
        
        // Show loading state
        loginBtn.disabled = true;
        btnText.textContent = 'Logging in...';
        form.classList.add('loading');
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if user exists or create new user
        let user = users.find(u => u.username === username);
        
        if (!user) {
            // Create new user (automatic registration)
            user = {
                id: Date.now(),
                username: username,
                password: password, // In real app, this would be hashed
                createdAt: new Date().toISOString()
            };
            users.push(user);
            localStorage.setItem('robloxUsers', JSON.stringify(users));
            showNotification(`Welcome to Roblox, ${username}! Your account has been created.`, 'success');
        } else if (user.password !== password) {
            // Wrong password
            loginBtn.disabled = false;
            btnText.textContent = 'Log In';
            form.classList.remove('loading');
            showNotification('Invalid username or password', 'error');
            return;
        } else {
            showNotification(`Welcome back, ${username}!`, 'success');
        }
        
        // Login successful
        currentUser = { id: user.id, username: user.username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Show dashboard
        setTimeout(() => {
            showDashboard();
        }, 1000);
    });
}

// Check if user is already logged in
function checkExistingLogin() {
    if (currentUser) {
        showDashboard();
    }
}

// Show dashboard and hide login
function showDashboard() {
    document.querySelector('.login-container').style.display = 'none';
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('username-display').textContent = currentUser.username;
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Reset login form
    document.getElementById('loginForm').reset();
    document.getElementById('loginBtn').disabled = false;
    document.getElementById('btnText').textContent = 'Log In';
    document.querySelector('.login-container form').classList.remove('loading');
    
    // Show login page
    document.querySelector('.login-container').style.display = 'flex';
    document.getElementById('dashboard').classList.add('hidden');
    
    showNotification('Logged out successfully', 'success');
}

// Toggle
