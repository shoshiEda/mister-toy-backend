import { MongoClient } from 'mongodb'

//import { config } from '../config/index.js'
import { loggerService } from './logger.service.js'

export const dbService = {
    getCollection
}

let config /*= {
    dbURL: 'mongodb://127.0.0.1:27017',
    dbName: 'mister-toy',
}*/
if (process.env.NODE_ENV === 'production') {
    config = {
        dbURL: process.env.MONGODB_URI,
        dbName: 'mister-toy'
    }
  } else {
    config = {
        dbURL: 'mongodb://127.0.0.1:27017',
        dbName: 'mister-toy',
    }
  }
  config.isGuestMode = true


var dbConn = null

async function getCollection(collectionName) {

    try {
        const db = await _connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        loggerService.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function _connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL)
        const db = client.db(config.dbName)
        dbConn = db
        return db
    } catch (err) {
        loggerService.error('Cannot Connect to DB', err)
        throw err
    }
}