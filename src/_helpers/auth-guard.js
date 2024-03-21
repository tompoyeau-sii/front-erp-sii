import router from '@/router'

export function authGuard(to) {
    let token = localStorage.getItem('token')
    // console.log(token)

    if (token) {
        return true
    }
    // return false
    localStorage.clear("token")
    localStorage.clear("userId")
    localStorage.clear("userName")
    localStorage.clear("isSimulation")
    router.push('/')
}   