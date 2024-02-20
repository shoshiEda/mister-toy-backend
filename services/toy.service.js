
import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = { name: '' }) {
   
    const sortDir=(filterBy.sortByDir==='true')? -1:1
       const regex = new RegExp(filterBy.name, 'i')
    var toysToReturn = toys.filter(toy => regex.test(toy.name))
    if (filterBy.maxPrice) {
        toysToReturn = toysToReturn.filter(toy => toy.price <= filterBy.maxPrice)
    }
    if (filterBy.inStock==='true') {
        toysToReturn = toysToReturn.filter(toy => toy.inStock)
    }
    if (filterBy.inStock==='false') {
        toysToReturn = toysToReturn.filter(toy => !toy.inStock)
    }
    if (filterBy.labels && filterBy.labels[0]) {
        toysToReturn = toysToReturn.filter(toy => filterBy.labels.every(label => toy.labels.includes(label)))
    }
    if (filterBy.sortBy==='name') {
        toysToReturn = toysToReturn.sort((toy1,toy2) => (toy1.name.localeCompare(toy2.name)*sortDir))
    }
    if (filterBy.sortBy==='price') {
        toysToReturn = toysToReturn.sort((toy1,toy2) => (toy1.price-toy2.price)*sortDir)
    }
    if (filterBy.sortBy==='createdAt') {
        toysToReturn = toysToReturn.sort((toy1,toy2) => (toy1.createdAt-toy2.createdAt)*sortDir)
    }
    return Promise.resolve(toysToReturn)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId, loggedinUser) {
    console.log(toys)
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')
    const toy = toys[idx]
   /* if (!loggedinUser.isAdmin &&
        toy.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your toy')
    }*/
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy, loggedinUser) {
    console.log(toy)
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
       /* if (!loggedinUser.isAdmin &&
            toyToUpdate.owner._id !== loggedinUser._id) {
            return Promise.reject('Not your toy')
        }*/
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.inStock = toy.inStock
        toyToUpdate.labels=toy.labels
        toy = toyToUpdate
    } else {
        toy._id = utilService.makeId()
        toy.createdAt= Date.now()
        toy.owner = {
            fullname: loggedinUser.fullname,
            score: loggedinUser.score,
            _id: loggedinUser._id,
            isAdmin: loggedinUser.isAdmin
        }
        toys.unshift(toy)
    }

    return _saveToysToFile().then(() => toy)
}


function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
