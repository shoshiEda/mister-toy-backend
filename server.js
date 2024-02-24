import path, { dirname } from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { fileURLToPath } from 'url'


import { toyService } from './services/toy.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

loggerService.info('server.js loaded...')

const app = express()

// Express Config:

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173','http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

// routes

/*import { authRoutes } from './'
app.use('/api/auth', authRoutes)

import { userRoutes } from './api/user/user.routes.js'
app.use('/api/user', userRoutes)

import { carRoutes } from './api/car/car.routes.js'
app.use('/api/car', carRoutes)

// Make every unmatched server-side-route fall back to index.html
// So when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


/* REST API for toys

// toy LIST
app.get('/api/toy', (req, res) => {
    const filterBy = {
        name: req.query.name || '',
        maxPrice: +req.query.maxPrice || 0,
        inStock: req.query.inStock || '',
        labels: req.query.labels || [],
        sortBy: req.query.sortBy || '',
        sortByDir: req.query.sortByDir || false,


    }
    toyService.query(filterBy)
        .then((toys) => {
            res.send(toys)
        })
        .catch((err) => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

// toy READ
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId)
        .then((toy) => {
            res.send(toy)
        })
        .catch((err) => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

// toy CREATE
app.post('/api/toy', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    //if (!loggedinUser) return res.status(401).send('Cannot add toy')
    const toy = {
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels,
        inStock: req.body.inStock,
    }
    toyService.save(toy, loggedinUser)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch((err) => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })

})

// toy UPDATE
app.put('/api/toy', (req, res) => {
    console.log(req.body)
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    //if (!loggedinUser) return res.status(401).send('Cannot update toy')
    const toy = {
        _id: req.body._id,
        name: req.body.name,
        inStock: req.body.inStock,
        price: +req.body.price,
        labels: req.body.labels,
    }
    toyService.save(toy, loggedinUser)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch((err) => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })

})

// toy DELETE
app.delete('/api/toy/:toyId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    loggerService.info('loggedinUser toy delete:', loggedinUser)
    /*if (!loggedinUser) {
        loggerService.info('Cannot remove toy, No user')
        return res.status(401).send('Cannot remove toy')
    }

    const { toyId } = req.params
    toyService.remove(toyId, loggedinUser)
        .then(() => {
            loggerService.info(`Toy ${toyId} removed`)
            res.send('Removed!')
        })
        .catch((err) => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })

})


// AUTH API
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                loggerService.info('Invalid Credentials', credentials)
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                loggerService.info('Cannot signup', credentials)
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


app.put('/api/user', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(400).send('No logged in user')
    const { diff } = req.body
    if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
    loggedinUser.score += diff
    return userService.save(loggedinUser).then(user => {
        const token = userService.getLoginToken(user)
        res.cookie('loginToken', token)
        res.send(user)
    })
})


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

*/
const port = process.env.PORT || 3030

app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
