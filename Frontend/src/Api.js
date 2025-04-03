import axios from 'axios';

// Basis-URL für die API
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:1000/api",
});


// Authentifizierungs-API
export const register = (userData) => API.post('api/auth/register', userData);
export const login = (userData) => { return API.post('/api/auth/login', userData);
};


// Projekt-API
export const getProjects = () => API.get('/api/projects');

export const getMyProjects = () => {
    return API.get('/api/projects/myprojects', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },});};

export const createProject = (data) => API.post('/api/projects', data, {
headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },});

export const getProjectDetails = (id) => API.get(`/api/projects/${id}`, {
headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },});

export const updateProject = (projectId, updates) => API.put(`/api/projects/${projectId}`, updates ,{
headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },});

export const deleteProject = (projectId) => API.delete(`/api/projects/${projectId}`, {
headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },});

// Aufgaben-API
export const getAllTasks = () => API.get('/api/tasks', {
headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },});

export const getMyTasks = () =>  API.get('/api/tasks/mytasks', {
headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },});

export const getTasks = (projectId) => API.get(`/api/projects/${projectId}/tasks`);

export const addTask = (projectId, taskData) => 
     API.post(`/api/projects/${projectId}/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      
    }
  });
    
  
export const updateTask = (projectId, taskId, updates) => API.put(`/api/projects/${projectId}/tasks/${taskId}`, updates, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    });

export const deleteTask = (projectId, taskId) => API.delete(`/api/projects/${projectId}/tasks/${taskId}`, {headers: {
  Authorization: `Bearer ${sessionStorage.getItem('token')}`

}});
