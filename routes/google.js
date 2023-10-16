import { Router } from 'express'
import * as googleCtrl from '../controllers/google.js'

const router = Router()

// GET localhost:3002
router.get('/:volumeId', googleCtrl.getBookDetailsById)
router.get('/:volumeId/comments', googleCtrl.getCommentsForBook)
router.post('/', googleCtrl.bookSearch)
router.post('/:volumeId/comments', googleCtrl.addCommentToBook)
export { router }