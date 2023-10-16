import { Router } from 'express'
import * as googleCtrl from '../controllers/google.js'

const router = Router()

// GET localhost:3002
router.get('/:volumeId', googleCtrl.getBookDetailsById)
router.post('/', googleCtrl.bookSearch)

export { router }