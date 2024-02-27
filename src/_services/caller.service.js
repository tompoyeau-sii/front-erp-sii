import axios from "axios";
import { accountService } from "./account.service";

const Axios = axios.create({
    baseURL: 'http://localhost:8080/api/'
})

Axios.interceptors.request.use(request => {
    let token = accountService.getToken()

    if(token) {
        request.headers.Authorization = token
    }
    return request
})

Axios.interceptors.response.use(
    response => response,
    error => {
        console.log("axios erreur : " + error.response.status)
        if (error.response.status === 401) {
            accountService.logout(); // Supprimez le token du localStorage
        }
        return Promise.reject(error);
    }
);

export default Axios