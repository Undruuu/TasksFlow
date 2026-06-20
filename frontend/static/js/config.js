export const API_BASE = '/api';

export const API_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    TASKS: '/tasks',
    TASK: (id) => `/tasks/${id}`
};

export function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

export function redirectToLogin() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}