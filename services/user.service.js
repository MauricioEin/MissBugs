const fs = require('fs')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.ENCRYPT_KEY)

const bugService = require('./bug.service.js')

const gUsers = require('../data/user.json')

module.exports = {
    query,
    getById,
    save,
    remove,
    checkLogin,
    getLoginToken,
    validateToken,
}

function query(filterBy) {
    return Promise.resolve(gUsers)
}



function getById(userId) {
    const user = gUsers.find(user => user._id === userId)
    if (!user) return Promise.reject('Unknown user')
    return Promise.resolve(user)
}

function save(user) {
    if (user._id) {
        const idx = gUsers.findIndex(currUser => currUser._id === user._id)
        if (idx === -1) return Promise.reject('No such Id for User')
        gUsers[idx] = user
    }
    else {
        user._id = _makeId()
        user.isAdmin = false
        gUsers.unshift(user)
    }
    return _saveUsersToFile().then(() => user)
}

function remove(userId) {
    const idx = gUsers.findIndex(user => user._id === userId)
    if (idx < 0) return Promise.reject('Unknown user')
    return bugService.query({ title: '', page: null, userId })
        .then(bugs => {
            if (bugs.length) return Promise.reject('Cannot delete user who owns bugs')
            gUsers.splice(idx, 1)
            return _saveUsersToFile()
        })
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gUsers, null, 2)

        fs.writeFile('data/user.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function checkLogin({ username, password }) {
    console.log('username:', username)
    var user = gUsers.find(user => user.username === username)
    if (user) {
        user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    }
    return Promise.resolve(user)
}


function getLoginToken(user) {
    console.log('tokenuser:', user)
    return cryptr.encrypt(JSON.stringify(user))
}


function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

