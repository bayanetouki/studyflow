 
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const getToken = () => localStorage.getItem('access_token');

export const apiClient = {

  // ─── AUTHENTIFICATION ───
  async register(email: string, name: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password, password2: password }),
    });
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.access) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('userName', data.user.name || data.user.email);
    }
    return data;
  },

  async logout() {
    const refresh = localStorage.getItem('refresh_token');
    await fetch(`${API_BASE}/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ refresh }),
    });
    localStorage.clear();
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile/`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },

  // ─── TÂCHES ───
  async getTasks(filters = '') {
    const res = await fetch(`${API_BASE}/tasks/${filters}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },

  async createTask(task: object) {
    const res = await fetch(`${API_BASE}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(task),
    });
    return res.json();
  },

  async updateTask(id: number, task: object) {
    const res = await fetch(`${API_BASE}/tasks/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(task),
    });
    return res.json();
  },

  async toggleTask(id: number) {
    const res = await fetch(`${API_BASE}/tasks/${id}/toggle/`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },

  async deleteTask(id: number) {
    await fetch(`${API_BASE}/tasks/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
  },

  async getTaskStats() {
    const res = await fetch(`${API_BASE}/tasks/stats/`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },

  // ─── POMODORO ───
  async createPomodoro(data: object) {
    const res = await fetch(`${API_BASE}/tasks/pomodoro/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async completePomodoro(id: number) {
    const res = await fetch(`${API_BASE}/tasks/pomodoro/${id}/complete/`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },

  // ─── CALENDRIER ───
  async getCalendarEvents(year?: number, month?: number) {
    const params = year && month ? `?year=${year}&month=${month}` : '';
    const res = await fetch(`${API_BASE}/tasks/calendar/${params}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },

  async createCalendarEvent(event: object) {
    const res = await fetch(`${API_BASE}/tasks/calendar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(event),
    });
    return res.json();
  },

  // ─── COLLABORATION ───
  async getTeams() {
    const res = await fetch(`${API_BASE}/collaboration/teams/`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },

  async createTeam(data: object) {
    const res = await fetch(`${API_BASE}/collaboration/teams/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async joinTeam(code: string) {
    const res = await fetch(`${API_BASE}/collaboration/teams/join/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ invitation_code: code }),
    });
    return res.json();
  },

  async getSharedTasks(teamId?: number) {
    const params = teamId ? `?team=${teamId}` : '';
    const res = await fetch(`${API_BASE}/collaboration/tasks/${params}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },

  async updateSharedTaskProgress(id: number, progress: number) {
    const res = await fetch(`${API_BASE}/collaboration/tasks/${id}/progress/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ progress }),
    });
    return res.json();
  },

  async getMessages(teamId: number) {
    const res = await fetch(`${API_BASE}/collaboration/messages/?team=${teamId}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },

  async sendMessage(teamId: number, content: string) {
    const res = await fetch(`${API_BASE}/collaboration/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ team: teamId, content }),
    });
    return res.json();
  },

  // ─── PROGRESSION ───
  async getProgressSummary() {
    const res = await fetch(`${API_BASE}/progress/summary/`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },

  async getDailyProgress() {
    const res = await fetch(`${API_BASE}/progress/daily/`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
  },
};