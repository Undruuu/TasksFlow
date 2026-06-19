export function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const colors = {
        success: 'bg-green-500/20 border-green-500/30 text-green-300',
        error: 'bg-red-500/20 border-red-500/30 text-red-300',
        info: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
        warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
    };
    
    toast.className = `toast ${colors[type] || colors.info}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

export function showLoading(containerId, message = 'Загрузка...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center text-slate-400 py-20">
                <div class="loader mx-auto mb-4"></div>
                <p>${message}</p>
            </div>
        `;
    }
}

export function formatDate(dateString) {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function getStatusBadge(status) {
    const badges = {
        'todo': 'bg-yellow-500/20 text-yellow-300',
        'in_progress': 'bg-blue-500/20 text-blue-300',
        'done': 'bg-green-500/20 text-green-300'
    };
    return badges[status] || 'bg-slate-500/20 text-slate-300';
}

export function getStatusLabel(status) {
    const labels = {
        'todo': 'To Do',
        'in_progress': 'In Progress',
        'done': 'Done'
    };
    return labels[status] || status;
}

export function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}