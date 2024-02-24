import { ObjectId } from 'mongodb'

import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    addCarMsg,
    removeCarMsg
}



async function query(filterBy = { name: '' }) {

        const criteria ={}
        const sortCriteria={}

        let pageIdx=0
        const MAX_TOYS_ON_PAGE=6

        
   
        const sortDir=(filterBy.sortByDir==='true')? -1:1
        if (filterBy.name) {
            const regex = new RegExp(filterBy.name, 'i')
            criteria.name = { $regex: regex }
        }
        if (filterBy.maxPrice) {
            criteria.price = { $lte: filterBy.maxPrice }        }

        if (filterBy.inStock==='true') {
            criteria.inStock = true
        }
        if (filterBy.inStock==='false') {
            criteria.inStock = false
        }
        if (filterBy.labels && filterBy.labels[0]) {
            if(filterBy.labels.length===1)
            criteria.labels = filterBy.labels[0]        

            else criteria.labels = filterBy.labels        }
        
        if (filterBy.sortBy==='name') {
            sortCriteria.name = sortDir
        }
        if (filterBy.sortBy==='price') {
            sortCriteria.price = sortDir
        }
        if (filterBy.sortBy==='createdAt') {
            sortCriteria.createdAt = sortDir
        }
        if (filterBy.pageIdx) {
            pageIdx+=  filterBy.pageIdx
        }

    try {      
        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).sort(sortCriteria).skip(pageIdx*MAX_TOYS_ON_PAGE).limit(MAX_TOYS_ON_PAGE).toArray()
        return toys
    } catch (err) {
        loggerService.error('cannot find toy', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ "_id":new ObjectId(toyId) })
        return toy
    } catch (err) {
        loggerService.error(`while finding car ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: new ObjectId(toyId) })
    } catch (err) {
        loggerService.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        loggerService.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price,
            labels:toy.labels,
            inStock:toy.inStock,
            createdAt:toy.createdAt
        }
        console.log('toyToSave',toyToSave)
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: new ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        loggerService.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}

async function addCarMsg(carId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('car')
        await collection.updateOne({ _id: new ObjectId(carId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        loggerService.error(`cannot add car msg ${carId}`, err)
        throw err
    }
}

async function removeCarMsg(carId, msgId) {
    try {
        const collection = await dbService.getCollection('car')
        await collection.updateOne({ _id: new ObjectId(carId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        loggerService.error(`cannot add car msg ${carId}`, err)
        throw err
    }
}