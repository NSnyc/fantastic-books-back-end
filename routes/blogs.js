import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as blogsCtrl from '../controllers/blogs.js'

const router = Router()

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.get('/', checkAuth, blogsCtrl.index)
router.post('/', checkAuth, blogsCtrl.create)
router.get('/:blogId', checkAuth, blogsCtrl.show)
router.put('/:blogId', checkAuth, blogsCtrl.update)
router.delete('/:blogId', checkAuth, blogsCtrl.delete)
router.post('/:blogId/comments', checkAuth, blogsCtrl.createBlogComment)

export { router }