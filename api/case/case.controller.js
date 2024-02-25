import { loggerService } from '../../services/logger.service.js'
import { caseService } from './case.service.js'



export async function getCases(req, res) {
    
    try{
    const filterBy = {
        txt: req.query.txt || '',
        isSent: req.query.isSent || '',
        sortBy: req.query.sortBy || '',
        pageIdx: +req.query.pageIdx || 0,


    }
    loggerService.debug('Getting Cases', filterBy)
    const cases = await caseService.query(filterBy)
    res.json(cases)
}
catch(err) {
    loggerService.error('Cannot get cases', err)
    res.status(400).send('Cannot get cases')
        }
}

export async function getCaseById(req, res) {
    try {
        const caseId = req.params.id
        console.log(caseId)

        const file = await caseService.getById(caseId)
        res.json(file)
    } catch (err) {
        loggerService.error('Failed to get case', err)
        res.status(500).send({ err: 'Failed to get case' })
    }
}

export async function addCase(req, res) {

    try {
        const file = req.body
        const addedCase = await caseService.add(file)
        res.json(addedCase)
    } 
    catch (err) {
        loggerService.error('Failed to add case', err)
        res.status(500).send({ err: 'Failed to add case' })   
}
}

export async function updateCase(req, res) {
    try {
        const file = req.body
        const updatedCase = await caseService.update(file)
        res.json(updatedCase)
    } catch (err) {
        loggerService.error('Failed to update case', err)
        res.status(500).send({ err: 'Failed to update case' })
    }
}

export async function removeCase(req, res) {
   
    try {
        const caseId = req.params.id
        await caseService.remove(caseId)
        res.send()
    } catch (err) {
        loggerService.error('Failed to remove case', err)
        res.status(500).send({ err: 'Failed to remove case' })
    }
}

export async function addCaseMsg(req, res) {
   
    console.log('req.body',req.body)
    try {
        const caseId = req.params.id
        const msg = {
            dateTime: req.body.dateTime,
            place: req.body.place,
            action: req.body.action,
            KM: +req.body.KM,
        }
        const savedMsg = await caseService.addCaseAct(caseId, msg)
        res.json(savedMsg)
    } catch (err) {
        loggerService.error('Failed to update case', err)
        res.status(500).send({ err: 'Failed to update case' })
    }
}

export async function removeCaseMsg(req, res) {
    
        const caseId = req.params.id
        const { msgId } = req.params
        console.log('caseId,msgId:',caseId,msgId)

    try{
        const removedId = await caseService.removeCaseMsg(caseId, msgId)
        res.send(removedId)
    } catch (err) {
        loggerService.error('Failed to remove case msg', err)
        res.status(500).send({ err: 'Failed to remove case msg' })
    }
}