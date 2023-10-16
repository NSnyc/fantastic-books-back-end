import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

import * as bookCtrl from '../controllers/book.js'

const router = Router()

// GET localhost:3001


export { router }