import { isAuthenticated } from './config.js';

function updateNavigation() {
    const authLink = document.getElementById('authLink');
    const ctaButton = document.getElementById('ctaButton');
    
    if (isAuthenticated()) {
        if (authLink) {
            authLink.textContent = 'Дашборд';
            authLink.href = '/tasks.html';
        }
        if (ctaButton) {
            ctaButton.textContent = 'Перейти к задачам';
            ctaButton.href = '/tasks.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', updateNavigation);