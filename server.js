const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug.service')
const userService = require('./services/user.service')
const pdfService = require('./services/pdf-service')

const bugs = require('./data/bug.json')



const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// LIST
app.get('/api/bug', (req, res) => {
    console.log('req.query:', req.query)
    const { title, page, userId } = req.query

    const filterBy = {
        title: title || '',
        page: page || 0,
        userId: userId || null
    }
    bugService.query(filterBy)
        .then(bugsAndPages => res.send(bugsAndPages))
        .catch((err) => res.status(500).send('Cannot get bugs'))

})

// ADD
app.post('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { title, description, severity } = req.body
    const bug = {
        title,
        description,
        severity: +severity,
        owner: loggedinUser
    }
    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
        .catch(err => res.status(400).send('Cannot save bug'))
})

// UPDATE
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { _id, title, description, severity } = req.body
    const bug = {
        _id,
        title,
        description,
        severity: +severity
    }
    bugService.save(bug, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => res.status(500).send('Cannot save bug'))
})


app.get('/api/bug/pdf', (req, res) => {
    pdfService.buildBugPDF(bugs).then(() => res.download('pdf/bugs.pdf'))
    // setTimeout(() => res.download('pdf/bugs.pdf'), 1000)
    // .then(file => res.download('pdf/bugs.pdf'))
    // const file = 'pdf/bugs.pdf' 

})

// READ
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => {
            const visitedBugs = JSON.parse(req.cookies.visitedBugs || '[]')

            if (!visitedBugs.includes(bugId)) {
                visitedBugs.push(bugId)
                if (visitedBugs.length > 3) return res.status(401).send('Wait for a bit')
            }
            res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7 * 1000 })
            res.send(bug)
        })
        .catch(err => res.send(err))
})



// DELETE
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => res.send('Removed!'))
        .catch((err) => res.status(500).send('Cannot remove bug'))
})

// USERS LOGIN SIGNUP

// SIGNUP
app.post('/api/auth/signup', (req, res) => {
    console.log('signup')
    userService.save(req.body)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
})

// LOGIN
app.post('/api/auth/login/', (req, res) => {
    console.log('we are here')
    console.log('reqBody:', req.body)
    userService.checkLogin(req.body)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid login')
            }
        })
})

// LOGOUT
app.post('/api/auth/logout/', (req, res) => {
    console.log('logout')
    userService.checkLogin(req.body)
        .then(user => {
            res.clearCookie('loginToken')
            res.send('logged out')
        })
})

// LIST
app.get('/api/auth/all', (req, res) => {
    console.log('enteredQuery')
    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch(err => res.send(err))
})
//READ USER
app.get('/api/auth/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user =>
            res.send(user))
        .catch(err => res.send(err))
})

//REMOVE USER
app.delete('/api/auth/:userId', (req, res) => {
    const { userId } = req.params
    userService.remove(userId)
        .then(() => res.send('User deleted'))
        .catch(err => res.send(err))
})





app.listen(3031, () => console.log('Server ready at port 3031!'))


