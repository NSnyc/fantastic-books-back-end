import { Router } from 'express'

import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

import * as bookCtrl from '../controllers/books.js'

const router = Router()

// GET localhost:3001
router.get('/:volumeId',  bookCtrl.getBookDetails)
router.get('/:volumeId/comments', bookCtrl.getComments)
router.get('/:volumeId/comments/:commentId', bookCtrl.getOneComment)
router.post('/', bookCtrl.bookSearch);

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.post('/:volumeId/comments', checkAuth, bookCtrl.createComment)
router.put('/:volumeId/comments/:commentId', checkAuth, bookCtrl.updateComment)
router.delete('/:volumeId/comments/:commentId', checkAuth, bookCtrl.deleteComment)


export { router }