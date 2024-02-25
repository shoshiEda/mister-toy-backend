import { ObjectId } from 'mongodb'

import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const caseService = {
    remove,
    query,
    getById,
    add,
    update,
    addCaseAct,
    removeCaseMsg
}

let sortDir=-1



async function query(filterBy = { }) {

        const criteria ={}
        const sortCriteria={}

        let pageIdx=0
        const MAX_TOYS_ON_PAGE=15

        console.log('filterBy',filterBy)
   
        sortDir=-sortDir

        if (filterBy.txt) {
            const regex = new RegExp(filterBy.txt, 'i')
            criteria.FileNumber = { $regex: regex }
        }

        if (filterBy.isSent==='true') {
            criteria.isSent = true
        }
        if (filterBy.isSent==='false') {
            criteria.isSent = false
        }
      
        if (filterBy.sortBy==='number') {
            sortCriteria.FileNumber = sortDir
        }
        if (filterBy.sortBy==='rdate') {
            sortCriteria.createdAt = sortDir
        }
        if (filterBy.sortBy==='sdate') {
            sortCriteria.sentAt = sortDir
        }
        if (filterBy.pageIdx) {
            pageIdx=  filterBy.pageIdx
        }

    try {   
        const collection = await dbService.getCollection('case')
        var cases = await collection.find(criteria).sort(sortCriteria).skip(pageIdx*MAX_TOYS_ON_PAGE).limit(MAX_TOYS_ON_PAGE).toArray()
        console.log('cases',cases)
        console.log('sortCriteria',sortCriteria)


        var casesLen = await collection.find(criteria).count()
       let maxPages = Math.ceil(casesLen/MAX_TOYS_ON_PAGE)
        return {cases,maxPages}
    } catch (err) {
        loggerService.error('cannot find case', err)
        throw err
    }
}

async function getById(caseId) {
    try {
        const collection = await dbService.getCollection('case')
        const file = await collection.findOne({ "_id":new ObjectId(caseId) })
        return file
    } catch (err) {
        loggerService.error(`while finding car ${caseId}`, err)
        throw err
    }
}

async function remove(caseId) {
    try {
        const collection = await dbService.getCollection('case')
        await collection.deleteOne({ _id: new ObjectId(caseId) })
    } catch (err) {
        loggerService.error(`cannot remove case ${caseId}`, err)
        throw err
    }
}

async function add(file) {
    try {
        console.log('file',file)
        const collection = await dbService.getCollection('case')
        await collection.insertOne(file)
        return file
    } catch (err) {
        loggerService.error('cannot insert case', err)
        throw err
    }
}

async function update(file) {
    try {
        console.log('caseToSave',file)
        const collection = await dbService.getCollection('case')
        await collection.updateOne({ _id: new ObjectId(file._id) }, { $set: {isSent:file.isSent , sentAt:file.sentAt, salery:file.salery} })
        return file
    } catch (err) {
        loggerService.error(`cannot update case ${file._id}`, err)
        throw err
    }
}

async function addCaseAct(caseId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('case')
        await collection.updateOne({ _id: new ObjectId(caseId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        loggerService.error(`cannot add case msg ${caseId}`, err)
        throw err
    }
}

async function removeCaseMsg(caseId, msgId) {
    console.log('caseId',caseId, msgId)
    try {
        const collection = await dbService.getCollection('case')
        await collection.updateOne({ _id: new ObjectId(caseId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        loggerService.error(`cannot add case msg ${caseId}`, err)
        throw err
    }
}