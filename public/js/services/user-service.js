import { eventBus, showSuccessMsg, showErrorMsg } from "./eventBus-service.js"
export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    getById,
    getAllUsers,
    remove
}
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'


const BASE_URL = `/api/auth/`

function login({ username, password }) {
    return axios.post(BASE_URL + 'login', { username, password })
        .then(res => res.data)
        .then(user => setLoggedinUser(user))
}

function signup({ fullname, username, password }) {
    const user = { fullname, username, password }
    return axios.post(BASE_URL + 'signup', user)
        .then(res => res.data)
        .then(user => setLoggedinUser(user))

}
function logout() {
    return axios.post(BASE_URL + 'logout')
        .then(() => sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER))
}


function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}

function getById(userId) {
    return axios.get(BASE_URL + userId)
        .then(res => res.data)
}

function getAllUsers() {
    return axios.get(BASE_URL + 'all').then(res => res.data)
}

function remove(userId) {
    return axios.delete(BASE_URL + userId)
        .then(res => {
            showSuccessMsg('User removed')
            return res.data
        })
        .catch(err => showErrorMsg(err))

}