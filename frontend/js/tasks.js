import { API_BASE, API_ENDPOINTS, getAuthHeaders, redirectToLogin } from './config.js';

export async function getTasks() {
    try {
        const response = await fetch(`${API_BASE}${API_ENDPOINTS.TASKS}`, {
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
        console.error('Error fetching tasks:', error);
        return null;
    }
}

export async function createTask(data) {
    try {
        const response = await fetch(`${API_BASE}${API_ENDPOINTS.TASKS}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
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
        console.error('Error creating task:', error);
        return null;
    }
}

export async function updateTask(id, data) {
    try {
        const response = await fetch(`${API_BASE}${API_ENDPOINTS.TASK(id)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
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
        console.error('Error updating task:', error);
        return null;
    }
}

export async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE}${API_ENDPOINTS.TASK(id)}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.status === 401) {
            redirectToLogin();
            return false;
        }

        return response.ok;
    } catch (error) {
        console.error('Error deleting task:', error);
        return false;
    }
}