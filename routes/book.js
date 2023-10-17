import { Router } from 'express'
import * as googleMiddleware from '../middleware/helper.js'

import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

import * as bookCtrl from '../controllers/books.js'

const router = Router()

// GET localhost:3001
router.get('/:volumeId', googleMiddleware.getBookDetailsByIdMiddleware, bookCtrl.getBookDetails)
router.post('/', googleMiddleware.fetchBooksMiddleware, bookCtrl.bookSearch);

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.post('/:volumeId/comments', checkAuth, googleMiddleware.getBookDetailsByIdMiddleware, bookCtrl.createComment)

export { router }