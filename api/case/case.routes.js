import express from 'express'

import { getCases, getCaseById, addCase, updateCase, removeCase, addCaseMsg, removeCaseMsg } from './case.controller.js'

export const caseRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

caseRoutes.get('/', getCases)
caseRoutes.get('/:id', getCaseById)
caseRoutes.post('/', addCase)
caseRoutes.put('/', updateCase)
caseRoutes.delete('/:id', removeCase)

caseRoutes.post('/:id/msg', addCaseMsg)
caseRoutes.delete('/:id/msg/:msgId', removeCaseMsg)