// Postfollower - Auth System
const AUTH_KEY = 'Postfollower_user';
const API_KEY_STORAGE = 'Postfollower_api_key';

function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) !== null;
}

function getCurrentUser() {
    const userData = localStorage.getItem(AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
}

function registerUser(name, email, password) {
    const user = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        credits: 1, // 1 generación gratis (5 posts)
        plan: 'free',
        createdAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
}

function loginUser(email, password) {
    const userData = localStorage.getItem(AUTH_KEY);
    if (!userData) return null;
    const user = JSON.parse(userData);
    if (user.email === email && user.password === password) return user;
    return null;
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
}

function updateCredits(newCredits) {
    const user = getCurrentUser();
    if (user) {
        user.credits = newCredits;
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
}

function getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE);
}

function setApiKey(key) {
    localStorage.setItem(API_KEY_STORAGE, key);
}

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function initDashboardAuth() {
    const user = getCurrentUser();
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const creditsCount = document.getElementById('creditsCount');
    const creditsDisplay = document.getElementById('creditsDisplay');

    if (user) {
        if (userAvatar) userAvatar.textContent = user.name.charAt(0).toUpperCase();
        if (userName) userName.textContent = user.name;
        if (creditsCount) creditsCount.textContent = user.credits;
        if (creditsDisplay) creditsDisplay.textContent = `${user.credits} generación${user.credits !== 1 ? 'es' : ''} restante${user.credits !== 1 ? 's' : ''}`;
    } else {
        const defaultUser = registerUser('Usuario Demo', 'demo@Postfollower.cl', 'demo123');
        if (userAvatar) userAvatar.textContent = 'U';
        if (userName) userName.textContent = defaultUser.name;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    const navLinks = document.querySelectorAll('.sidebar-nav a[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            if (page === 'generator') {
                document.querySelector('.generator-card').style.display = 'block';
                document.querySelector('.stats-grid').style.display = 'grid';
                document.querySelector('.dashboard-header').style.display = 'block';
                document.getElementById('historySection').style.display = 'none';
            } else if (page === 'history') {
                document.querySelector('.generator-card').style.display = 'none';
                document.querySelector('.stats-grid').style.display = 'none';
                document.querySelector('.dashboard-header').style.display = 'none';
                document.getElementById('historySection').style.display = 'block';
                renderHistory();
            }
        });
    });
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('active'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    if (document.querySelector('.dashboard-layout')) initDashboardAuth();
});
