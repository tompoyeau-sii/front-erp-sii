import axios from "axios";
import { accountService } from "./account.service";

let url;
getUrl();
export function getUrl() {
    let nom = null;
    if (localStorage.getItem("userName")) {
        const username = localStorage.getItem("userName");
        const mots = username.split(" ");
        nom = mots[1].toLowerCase();
    }

    console.log("ici")

    return localStorage.getItem("isSimulation") === "true"
        ? url = "http://localhost:8080/api/" + nom
        : url = "http://localhost:8080/api/production";
}

const Axios = axios.create({
    baseURL: url
})

Axios.interceptors.request.use(request => {
    let token = accountService.getToken()

    if(token) {
        request.headers.Authorization = "Bearer " + token
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