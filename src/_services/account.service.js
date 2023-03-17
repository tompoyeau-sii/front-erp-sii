import Axios from "./caller.service";

let login = (login) => {
    return Axios.post('/login', login)
}

let logout = () => {
    localStorage.removeItem('token')
}

let saveToken = (token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('connected', true)
}

let isLogged = () => {
    let token = localStorage.getItem('token')
    return !!token
}

export const accountService = {
    login,
    logout,
    saveToken,
    isLogged,
}