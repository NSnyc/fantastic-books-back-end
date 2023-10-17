import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as blogsCtrl from '../controllers/blogs.js'

const router = Router()

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)


export { router }