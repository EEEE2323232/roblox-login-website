// Roblox Login Website JavaScript - Fixed Version
// Enhanced with better data persistence and privacy protection

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

// Enhanced storage functions with error handling
function loadUsers() {
    try {
        const data = localStorage.getItem('robloxUsers');
        if (!data) return [];
        const users = JSON.parse(data);
        console.log('📥 Loaded users from storage:', users.length, 'users');
        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error('❌ Error loading users:', error);
        return [];
    }
}

function saveUsers(users) {
    try {
        if (!Array.isArray(users)) {
            console.error('❌ Invalid users data - not an array');
            return false;
        }
        localStorage.setItem('robloxUsers', JSON.stringify(users));
        console.log('💾 Saved users to storage:', users.length, 'users');
        
        // Trigger storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'robloxUsers',
            newValue: JSON.stringify(users),
            storageArea: localStorage
        }));
        
        return true;
    } catch (error) {
        console.error('❌ Error saving users:', error);
        return false;
    }
}

function loadCurrentUser() {
    try {
        const data = localStorage.getItem('currentUser');
        if (!data) return null;
        const user = JSON.parse(data);
        console.log('👤 Current user loaded:', user?.username || 'none');
        return user;
    } catch (error) {
        console.error('❌ Error loading current user:', error);
        return null;
    }
}

function saveCurrentUser(user) {
    try {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log('👤 Current user saved:', user.username);
        } else {
            localStorage.removeItem('currentUser');
            console.log('👤 Current user cleared');
        }
        return true;
    } catch (error) {
        console.error('❌ Error saving current user:', error);
        return false;
    }
}

// Simple hash function for password protection (basic obfuscation)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
}

// Global variables
let users = [];
let currentUser = null;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Roblox Login System...');
    
    // Load data from storage
    users = loadUsers();
    currentUser = loadCurrentUser();
    
    // Initialize UI
    createBackgroundGrid();
    setupLoginForm();
    checkExistingLogin();
    updateAdminPanel();
    
    // Listen for storage changes (for multiple tabs)
    window.addEventListener('storage', function(e) {
        if (e.key === 'robloxUsers') {
            users = loadUsers();
            updateAdminPanel();
        }
        if (e.key === 'currentUser') {
            currentUser = loadCurrentUser();
            updateAdminPanel();
        }
    });
    
    console.log('✅ System initialized successfully!');
});

// Create dynamic background grid
function createBackgroundGrid() {
    const grid = document.getElementById('backgroundGrid');
    if (!grid) return;
    
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
    if (!form) return;
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Validation
        if (!username || !password) {
            showNotification('Please enter both username and password', 'error');
            return;
        }
        
        if (username.length < 3) {
            showNotification('Username must be at least 3 characters long', 'error');
            return;
        }
        
        if (password.length < 4) {
            showNotification('Password must be at least 4 characters long', 'error');
            return;
        }
        
        // Show loading state
        loginBtn.disabled = true;
        btnText.textContent = 'Logging in...';
        form.classList.add('loading');
        
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Reload users to ensure fresh data
            users = loadUsers();
            
            // Hash the password for comparison
            const hashedPassword = hashPassword(password);
            
            // Check if user exists
            let user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
            
            if (!user) {
                // Create new user (auto-registration)
                user = {
                    id: Date.now() + Math.random(), // Unique ID
                    username: username,
                    passwordHash: hashedPassword,
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    loginCount: 1
                };
                
                users.push(user);
                
                if (saveUsers(users)) {
                    showNotification(`Welcome to Roblox, ${username}! Your account has been created.`, 'success');
                    console.log('👤 New user created:', username);
                } else {
                    throw new Error('Failed to save user data');
                }
            } else {
                // Existing user - check password
                if (user.passwordHash !== hashedPassword) {
                    loginBtn.disabled = false;
                    btnText.textContent = 'Log In';
                    form.classList.remove('loading');
                    showNotification('Invalid username or password', 'error');
                    return;
                }
                
                // Update last login
                user.lastLogin = new Date().toISOString();
                user.loginCount = (user.loginCount || 0) + 1;
                
                // Update user in array
                const userIndex = users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex] = user;
                    saveUsers(users);
                }
                
                showNotification(`Welcome back, ${username}!`, 'success');
                console.log('👤 User logged in:', username);
            }
            
            // Set current user (without sensitive data)
            currentUser = {
                id: user.id,
                username: user.username,
                loginTime: new Date().toISOString()
            };
            
            saveCurrentUser(currentUser);
            updateAdminPanel();
            
            // Show dashboard after delay
            setTimeout(() => {
                showDashboard();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Login error:', error);
            showNotification('Login failed. Please try again.', 'error');
            
            // Reset form
            loginBtn.disabled = false;
            btnText.textContent = 'Log In';
            form.classList.remove('loading');
        }
    });
}

// Enhanced Admin Panel Functions
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (!panel) return;
    
    panel.classList.toggle('hidden');
    
    if (!panel.classList.contains('hidden')) {
        // Refresh data when opening
        users = loadUsers();
        currentUser = loadCurrentUser();
        updateAdminPanel();
        console.log('👑 Admin panel opened');
    }
}

function updateAdminPanel() {
    try {
        // Always use fresh data
        users = loadUsers();
        currentUser = loadCurrentUser();
        
        const totalUsers = users.length;
        const onlineUsers = currentUser ? 1 : 0;
        
        // Update stats
        const totalUsersEl = document.getElementById('totalUsers');
        const onlineUsersEl = document.getElementById('onlineUsers');
        
        if (totalUsersEl) totalUsersEl.textContent = totalUsers;
        if (onlineUsersEl) onlineUsersEl.textContent = onlineUsers;
        
        // Update user table
        const userTable = document.getElementById('userTable');
        if (!userTable) return;
        
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
            const onlineIndicator = isOnline ? ' 🟢' : ' 🔴';
            
            // Privacy protection: mask password hash
            const maskedPassword = user.passwordHash ? '•'.repeat(8) : 'No password';
            
            userRow.innerHTML = `
                <div class="user-info">
                    <div class="user-name">${user.username}${onlineIndicator}</div>
                    <div class="user-details">
                        Password: <span class="user-password">${maskedPassword}</span><br>
                        Created: ${new Date(user.createdAt).toLocaleDateString()}<br>
                        Last login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}<br>
                        Login count: ${user.loginCount || 0}
                    </div>
                </div>
            `;
            
            tableDiv.appendChild(userRow);
        });
        
        userTable.appendChild(tableDiv);
        
        console.log('👑 Admin panel updated - Users:', totalUsers, 'Online:', onlineUsers);
        
    } catch (error) {
        console.error('❌ Error updating admin panel:', error);
    }
}

function exportUsers() {
    try {
        users = loadUsers(); // Refresh data
        
        const data = {
            exportDate: new Date().toISOString(),
            totalUsers: users.length,
            users: users.map(user => ({
                id: user.id,
                username: user.username,
                // Privacy: Don't export password hash
                passwordProtected: !!user.passwordHash,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
                loginCount: user.loginCount || 0
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
        
        showNotification('User data exported successfully! (Passwords excluded for privacy)', 'success');
        console.log('📤 User data exported');
        
    } catch (error) {
        console.error('❌ Export error:', error);
        showNotification('Export failed. Please try again.', 'error');
    }
}

function clearAllUsers() {
    if (confirm('Are you sure you want to delete all users? This cannot be undone.')) {
        try {
            users = [];
            currentUser = null;
            
            localStorage.removeItem('robloxUsers');
            localStorage.removeItem('currentUser');
            
            updateAdminPanel();
            
            // Reset login form
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.reset();
                const loginBtn = document.getElementById('loginBtn');
                const btnText = document.getElementById('btnText');
                if (loginBtn) loginBtn.disabled = false;
                if (btnText) btnText.textContent = 'Log In';
                loginForm.classList.remove('loading');
            }
            
            // Return to login if on dashboard
            if (!document.getElementById('dashboard')?.classList.contains('hidden')) {
                logout();
            }
            
            showNotification('All user data cleared!', 'success');
            console.log('🗑️ All user data cleared');
            
        } catch (error) {
            console.error('❌ Clear data error:', error);
            showNotification('Failed to clear data. Please try again.', 'error');
        }
    }
}

// Check if user is already logged in
function checkExistingLogin() {
    currentUser = loadCurrentUser();
    if (currentUser) {
        console.log('👤 Found existing session for:', currentUser.username);
        showDashboard();
    }
}

// Show dashboard and hide login
function showDashboard() {
    const loginContainer = document.querySelector('.login-container');
    const dashboard = document.getElementById('dashboard');
    const usernameDisplay = document.getElementById('username-display');
    
    if (loginContainer) loginContainer.style.display = 'none';
    if (dashboard) dashboard.classList.remove('hidden');
    if (usernameDisplay && currentUser) usernameDisplay.textContent = currentUser.username;
    
    updateAdminPanel();
    console.log('🎮 Dashboard shown for:', currentUser?.username);
}

// Logout function
function logout() {
    const username = currentUser?.username;
    
    currentUser = null;
    saveCurrentUser(null);
    
    // Reset login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.reset();
        const loginBtn = document.getElementById('loginBtn');
        const btnText = document.getElementById('btnText');
        if (loginBtn) loginBtn.disabled = false;
        if (btnText) btnText.textContent = 'Log In';
        loginForm.classList.remove('loading');
    }
    
    // Show login page
    const loginContainer = document.querySelector('.login-container');
    const dashboard = document.getElementById('dashboard');
    if (loginContainer) loginContainer.style.display = 'flex';
    if (dashboard) dashboard.classList.add('hidden');
    
    updateAdminPanel();
    
    showNotification(`Logged out successfully${username ? ` (${username})` : ''}`, 'success');
    console.log('👋 User logged out:', username);
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (!passwordInput || !toggleBtn) return;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        error: '#dc3545',
        success: '#28a745',
        info: '#007bff',
        warning: '#ffc107'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 400px;
        animation: slideIn 0.3s ease;
        font-size: 14px;
    `;
    
    // Add animation styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
            .notification-close:hover {
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Game interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('play-btn')) {
        const gameCard = e.target.closest('.game-card');
        if (gameCard) {
            const gameTitle = gameCard.querySelector('h4')?.textContent || 'Unknown Game';
            showNotification(`🎮 Launching ${gameTitle}...`, 'info');
            console.log('🎮 Game launched:', gameTitle);
        }
    }
});

// Easter eggs
let logoClickCount = 0;
document.addEventListener('click', function(e) {
    if (e.target.closest('.logo h1')) {
        logoClickCount++;
        if (logoClickCount === 5) {
            showNotification('🎮 You found the secret! Roblox power activated!', 'success');
            console.log('🎉 Easter egg activated!');
            logoClickCount = 0;
        }
    }
});

// Debug functions for development
window.debugRobloxSystem = function() {
    console.log('=== ROBLOX SYSTEM DEBUG ===');
    console.log('Users in storage:', loadUsers().length);
    console.log('Current user:', loadCurrentUser());
    console.log('Users array:', users.length);
    console.log('Current user var:', currentUser);
    console.log('localStorage keys:', Object.keys(localStorage).filter(k => k.startsWith('roblox')));
};

window.forceRefresh = function() {
    users = loadUsers();
    currentUser = loadCurrentUser();
    updateAdminPanel();
    console.log('🔄 Data refreshed');
};

// Initialize system
console.log('🎮 Roblox Login System v2.0 loaded!');
console.log('💡 Tips:');
console.log('  - Click the Roblox logo 5 times for a surprise!');
console.log('  - Use the Admin panel to manage users');
console.log('  - Type debugRobloxSystem() for debug info');
console.log('  - Type forceRefresh() to refresh data');
