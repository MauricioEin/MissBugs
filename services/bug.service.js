const fs = require('fs')
const gBugs = require('../data/bug.json')

module.exports = {
    query,
    getById,
    save,
    remove

}
const itemsPerPage = 3

function query(filterBy) {
    const { title, page, userId } = filterBy
    if (userId)
        return Promise.resolve(gBugs.filter(bug => bug.owner._id === userId))
    const regex = new RegExp(title, 'i')
    let filteredBugs = gBugs.filter((bug) => regex.test(bug.title))
    const startIdx = page * itemsPerPage
    const totalPages = Math.ceil(filteredBugs.length / itemsPerPage)
    filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage)
    return Promise.resolve({ totalPages, filteredBugs })
}


function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('No such bug')
    return Promise.resolve(bug)
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const idx = gBugs.findIndex(currBug => currBug._id === bug._id)
        if (idx === -1) return Promise.reject('no bug by that id')
        if (gBugs[idx].owner._id !== loggedinUser._id && !loggedinUser.isAdmin) return Promise.reject('Not your bug')
        gBugs[idx].title = bug.title
        gBugs[idx].severity = bug.severity
        gBugs[idx].description = bug.description
    }
    else {
        bug._id = _makeId()
        bug.createdAt = Date.now()
        gBugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function remove(bugId, loggedinUser) {
    console.log('loggedin:', loggedinUser)
    const idx = gBugs.findIndex(bug => bug._id === bugId)
    if (idx < 0) return Promise.reject('Unknown bug')
    if (gBugs[idx].owner._id !== loggedinUser._id && !loggedinUser.isAdmin) return Promise.reject('Not your bug')
    gBugs.splice(idx, 1)
    return _saveBugsToFile()
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}