import { login, register, isAuthenticated } from './auth.js';
import { showToast } from './ui.js';

const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const message = document.getElementById('message');

function switchTab(tab) {
    const isLogin = tab === 'login';
    
    loginTab.className = `flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
        isLogin ? 'bg-purple-600 text-white' : 'text-purple-300 hover:text-white'
    }`;
    
    registerTab.className = `flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
        !isLogin ? 'bg-purple-600 text-white' : 'text-purple-300 hover:text-white'
    }`;
    
    loginForm.classList.toggle('hidden', !isLogin);
    registerForm.classList.toggle('hidden', isLogin);
    
    message.classList.add('hidden');
}

function showMessage(text, type = 'info') {
    message.textContent = text;
    const bgColors = {
        error: 'bg-red-500/20 text-red-300 border border-red-500/30',
        success: 'bg-green-500/20 text-green-300 border border-green-500/30',
        info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
    };
    message.className = `mt-4 text-sm text-center p-3 rounded-lg ${bgColors[type] || bgColors.info}`;
    message.classList.remove('hidden');
}

loginTab.addEventListener('click', () => switchTab('login'));
registerTab.addEventListener('click', () => switchTab('register'));

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('Заполните все поля', 'error');
        return;
    }
    
    const result = await login(email, password);
    
    if (result.success) {
        window.location.href = '/tasks.html';
    } else {
        showMessage(result.error, 'error');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!username || !email || !password) {
        showMessage('Заполните все поля', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Пароль должен содержать минимум 6 символов', 'error');
        return;
    }
    
    const result = await register(username, email, password);
    
    if (result.success) {
        showMessage('Аккаунт создан. Теперь войдите.', 'success');
        document.getElementById('loginEmail').value = email;
        setTimeout(() => switchTab('login'), 1000);
    } else {
        showMessage(result.error, 'error');
    }
});

if (isAuthenticated()) {
    window.location.href = '/tasks.html';
}

message.addEventListener('click', () => {
    message.classList.add('hidden');
});