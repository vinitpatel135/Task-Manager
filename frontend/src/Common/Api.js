import axios from "axios"

class Api {
    constructor() {
        this.baseUrl = "http://localhost:5000"
    }

    getToken() {
        return JSON.parse(localStorage.getItem("token"))
    }

    register(data) {
        return axios.post(`${this.baseUrl}/register`, data)
    }
    login(data) {
        return axios.post(`${this.baseUrl}/login`, data)
    }
    addTask(data) {
        const token = this.getToken();
        return axios.post(`${this.baseUrl}/task`, data, { headers: { token: token } })
    }
    getTask(data) {
        const token = this.getToken();
        return axios.get(`${this.baseUrl}/tasks`, { headers: { token: token } })
    }
    deleteTask(id) {
        const token = this.getToken();
        return axios.delete(`${this.baseUrl}/task/${id}`, { headers: { token: token } })
    }
    updateTask(id, data) {
        const token = this.getToken();
        return axios.put(`${this.baseUrl}/task/${id}`, data, { headers: { token: token } })
    }

}

const api = new Api()
export default api