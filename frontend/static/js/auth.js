import { API_BASE, API_ENDPOINTS, getAuthHeaders, redirectToLogin } from './config.js';

export async function login(email, password) {
    const response = await fetch(`${API_BASE}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', data.username);
        return { success: true, data };
    }
    
    return { success: false, error: data.detail || 'Ошибка входа' };
}

export async function register(username, email, password) {
    const response = await fetch(`${API_BASE}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
        return { success: true, data };
    }
    
    return { success: false, error: data.detail || 'Ошибка регистрации' };
}

export async function getCurrentUser() {
    try {
        const response = await fetch(`${API_BASE}${API_ENDPOINTS.ME}`, {
            headers: getAuthHeaders()
        });

        if (response.status === 401) {
            redirectToLogin();
            return null;
        }

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login.html';
}

export function isAuthenticated() {
    return !!localStorage.getItem('token');
}

export function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}