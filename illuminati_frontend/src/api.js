import axios from "axios";


export function getAuthToken() {
    return sessionStorage.getItem("jwtToken");
}

const API_BASE = import.meta.env.VITE_API_BASE;

const client = axios.create({
    baseURL: API_BASE,
    timeout: 5000,
});


client.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});


export async function verifyEntryPassword(password) {
    const res = await client.post("/api/authentific/entry/", { password });
    return res.data;
}


export async function login(email, password) {
    const res = await client.post("/api/authentific/login/", { email, password });

    if (res.data.token) {
        sessionStorage.setItem("jwtToken", res.data.token);
    }
    return res.data;
}


export async function register(username, email, password) {
    const res = await client.post("/api/authentific/register/", { username, email, password });
    return res.data;
}


export async function getTaskDetail(id) {
    const token = getAuthToken();
    const res = await client.get(`/api/calculations/tasks/${id}/`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return res.data;
}


export async function getMyTasks() {
    const res = await client.get("/api/calculations/tasks/my/");
    return res.data;
}


export async function sendMatrices(matrixA, matrixB) {

    try {
        const res = await client.post("/api/calculations/tasks/", {
            input_data: { A: matrixA, B: matrixB }
        });
        return res.data;
    }

    catch (err) {

        if (err.response && err.response.status === 400) {
            alert(err.response.data.error);
        }

        else {
            console.error("Matrix send error:", err);
        }
    }
}


export async function cancelTask(taskId) {

    try {
        const res = await client.post(`/api/calculations/tasks/${taskId}/cancel/`);
        return res.data;
    }

    catch (err) {
        console.error("Cancel task error:", err.response ? err.response.data : err.message);
        throw err;
    }
}

export default client;
