import { getCurrentUser, logout, checkAuth } from './auth.js';
import { getTasks, createTask, updateTask, deleteTask } from './tasks.js';
import { 
    showToast, 
    openModal, 
    closeModal, 
    getStatusBadge, 
    getStatusLabel,
    escapeHtml,
    showLoading
} from './ui.js';

var state = {
    tasks: [],
    currentFilter: 'all',
    editingTaskId: null
};

var elements = {
    tasksList: document.getElementById('tasksList'),
    userGreeting: document.getElementById('userGreeting'),
    logoutBtn: document.getElementById('logoutBtn'),
    openCreateBtn: document.getElementById('openCreateModal'),
    taskModal: document.getElementById('taskModal'),
    taskForm: document.getElementById('taskForm'),
    modalTitle: document.getElementById('modalTitle'),
    taskId: document.getElementById('taskId'),
    taskTitle: document.getElementById('taskTitle'),
    taskDescription: document.getElementById('taskDescription'),
    taskStatus: document.getElementById('taskStatus'),
    taskDeadline: document.getElementById('taskDeadline'),
    closeModalBtn: document.getElementById('closeModal'),
    filterBtns: document.querySelectorAll('.filter-btn')
};

async function init() {
    if (!checkAuth()) return;
    
    await loadUser();
    await loadTasks();
    setupEventListeners();
}

async function loadUser() {
    var user = await getCurrentUser();
    if (user) {
        elements.userGreeting.textContent = 'Привет, ' + user.username;
    }
}

async function loadTasks() {
    showLoading('tasksList');
    
    var tasks = await getTasks();
    if (tasks !== null) {
        state.tasks = tasks;
        renderTasks();
    }
}

function renderTasks() {
    var filtered;
    if (state.currentFilter === 'all') {
        filtered = state.tasks;
    } else {
        filtered = [];
        for (var i = 0; i < state.tasks.length; i++) {
            if (state.tasks[i].status === state.currentFilter) {
                filtered.push(state.tasks[i]);
            }
        }
    }

    if (filtered.length === 0) {
        elements.tasksList.innerHTML = 
            '<div class="text-center text-slate-400 py-20">' +
                '<div class="text-6xl mb-4"></div>' +
                '<p>' + (state.currentFilter === 'all' ? 'Нет задач. Создайте первую.' : 'Нет задач в этом статусе') + '</p>' +
            '</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < filtered.length; i++) {
        var task = filtered[i];
        var deadlineHtml = '';
        if (task.deadline) {
            var date = new Date(task.deadline);
            deadlineHtml = '<p class="text-xs text-purple-300/60">' + date.toLocaleDateString('ru-RU') + '</p>';
        }
        
        var descriptionHtml = '';
        if (task.description) {
            descriptionHtml = '<p class="text-slate-400 text-sm mb-2">' + escapeHtml(task.description) + '</p>';
        }

        html += 
            '<div class="task-card bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition group">' +
                '<div class="flex justify-between items-start">' +
                    '<div class="flex-1">' +
                        '<div class="flex items-center gap-3 mb-2 flex-wrap">' +
                            '<h3 class="text-xl font-semibold text-white">' + escapeHtml(task.title) + '</h3>' +
                            '<span class="status-badge text-xs px-3 py-1 rounded-full ' + getStatusBadge(task.status) + '">' +
                                getStatusLabel(task.status) +
                            '</span>' +
                        '</div>' +
                        descriptionHtml +
                        deadlineHtml +
                    '</div>' +
                    '<div class="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition">' +
                        '<button onclick="window.editTask(\'' + task.id + '\')" ' +
                                'class="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition text-xs">' +
                            'Изменить' +
                        '</button>' +
                        '<button onclick="window.deleteTask(\'' + task.id + '\')" ' +
                                'class="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition text-xs">' +
                            'Удалить' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }
    
    elements.tasksList.innerHTML = html;
}

function setupEventListeners() {
    elements.logoutBtn.addEventListener('click', logout);
    elements.openCreateBtn.addEventListener('click', function() { openCreateModal(); });
    elements.closeModalBtn.addEventListener('click', function() { closeModal(); });
    elements.taskModal.addEventListener('click', function(e) {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    });
    elements.taskForm.addEventListener('submit', handleTaskSubmit);
    
    for (var i = 0; i < elements.filterBtns.length; i++) {
        var btn = elements.filterBtns[i];
        btn.addEventListener('click', function() {
            for (var j = 0; j < elements.filterBtns.length; j++) {
                elements.filterBtns[j].classList.remove('bg-purple-600', 'text-white');
                elements.filterBtns[j].classList.add('bg-slate-700', 'text-slate-300');
            }
            this.classList.remove('bg-slate-700', 'text-slate-300');
            this.classList.add('bg-purple-600', 'text-white');
            
            state.currentFilter = this.dataset.filter;
            renderTasks();
        });
    }
}

function openCreateModal() {
    elements.modalTitle.textContent = 'Создать задачу';
    elements.taskForm.reset();
    elements.taskId.value = '';
    state.editingTaskId = null;
    openModal('taskModal');
}

window.editTask = function(id) {
    var task = null;
    for (var i = 0; i < state.tasks.length; i++) {
        if (state.tasks[i].id === id) {
            task = state.tasks[i];
            break;
        }
    }
    if (!task) return;

    elements.modalTitle.textContent = 'Редактировать задачу';
    elements.taskId.value = task.id;
    elements.taskTitle.value = task.title;
    elements.taskDescription.value = task.description || '';
    elements.taskStatus.value = task.status;
    elements.taskDeadline.value = task.deadline ? task.deadline.split('T')[0] : '';
    state.editingTaskId = id;
    
    openModal('taskModal');
};

window.deleteTask = function(id) {
    if (!confirm('Вы уверены?')) return;
    
    deleteTask(id).then(function(success) {
        if (success) {
            showToast('Задача удалена', 'success');
            loadTasks();
        } else {
            showToast('Ошибка при удалении', 'error');
        }
    });
};

async function handleTaskSubmit(e) {
    e.preventDefault();
    
    var data = {
        title: elements.taskTitle.value.trim(),
        description: elements.taskDescription.value.trim(),
        status: elements.taskStatus.value,
        deadline: elements.taskDeadline.value || null
    };
    
    if (!data.title) {
        showToast('Название обязательно', 'error');
        return;
    }
    
    var id = elements.taskId.value;
    var isEditing = !!id;
    
    var result;
    if (isEditing) {
        result = await updateTask(id, data);
    } else {
        result = await createTask(data);
    }
    
    if (result) {
        closeModal();
        showToast(isEditing ? 'Задача обновлена' : 'Задача создана', 'success');
        await loadTasks();
    } else {
        showToast(isEditing ? 'Ошибка обновления' : 'Ошибка создания', 'error');
    }
}

document.addEventListener('DOMContentLoaded', init);