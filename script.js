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
    updateAdminPanel();
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
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
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
            // Update last login
            user.lastLogin = new Date().toISOString();
            localStorage.setItem('robloxUsers', JSON.stringify(users));
            showNotification(`Welcome back, ${username}!`, 'success');
        }
        
        // Login successful
        currentUser = { id: user.id, username: user.username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update admin panel
        updateAdminPanel();
        
        // Show dashboard
        setTimeout(() => {
            showDashboard();
        }, 1000);
    });
}

// Admin Panel Functions
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
        updateAdminPanel();
    }
}

function updateAdminPanel() {
    const totalUsers = users.length;
    const onlineUsers = currentUser ? 1 : 0;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('onlineUsers').textContent = onlineUsers;
    
    const userTable = document.getElementById('userTable');
    userTable.innerHTML = '';
    
    if (users.length === 0) {
        userTable.innerHTML = '<div style="text-align: center; color: #6c757d; padding: 20px;">No users registered yet</div>';
        return;
    }
    
    const tableDiv = document.createElement('div');
    tableDiv.className = 'user-table';
    
    users.forEach(user => {
        const userRow = document.createElement('div');
        userRow.className = 'user-row';
        
        const isOnline = currentUser && currentUser.username === user.username;
        const onlineIndicator = isOnline ? ' 🟢' : '';
        
        userRow.innerHTML = `
            <div class="user-info">
                <div class="user-name">${user.username}${onlineIndicator}</div>
                <div class="user-details">
                    Password: <span class="user-password">${user.password}</span><br>
                    Created: ${new Date(user.createdAt).toLocaleDateString()}
                    ${user.lastLogin ? `<br>Last login: ${new Date(user.lastLogin).toLocaleDateString()}` : ''}
                </div>
            </div>
        `;
        
        tableDiv.appendChild(userRow);
    });
    
    userTable.appendChild(tableDiv);
}

function exportUsers() {
    const data = {
        exportDate: new Date().toISOString(),
        totalUsers: users.length,
        users: users.map(user => ({
            username: user.username,
            password: user.password,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roblox-users-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('User data exported successfully!', 'success');
}

function clearAllUsers() {
    if (confirm('Are you sure you want to delete all users? This cannot be undone.')) {
        users = [];
        currentUser = null;
        localStorage.removeItem('robloxUsers');
        localStorage.removeItem('currentUser');
        updateAdminPanel();
        
        // Reset login form if on login page
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
            document.getElementById('loginBtn').disabled = false;
            document.getElementById('btnText').textContent = 'Log In';
            loginForm.classList.remove('loading');
        }
        
        // Show login page if on dashboard
        if (!document.getElementById('dashboard').classList.contains('hidden')) {
            logout();
        }
        
        showNotification('All user data cleared!', 'success');
    }
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
    updateAdminPanel();
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
    
    // Update admin panel
    updateAdminPanel();
    
    showNotification('Logged out successfully', 'success');
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Game card interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('play-btn')) {
        const gameCard = e.target.closest('.game-card');
        const gameTitle = gameCard.querySelector('h4').textContent;
        showNotification(`Launching ${gameTitle}...`, 'info');
    }
});

// Add some Easter eggs for fun
let clickCount = 0;
document.addEventListener('click', function(e) {
    if (e.target.closest('.logo h1')) {
        clickCount++;
        if (clickCount === 5) {
            showNotification('🎮 You found the secret! Roblox power activated!', 'success');
            clickCount = 0;
        }
    }
});

console.log('🎮 Roblox Login Website loaded successfully!');
console.log('💡 Tip: Click the Roblox logo 5 times for a surprise!');
console.log('👑 Admin Panel: Click the "Admin" button to manage users');
