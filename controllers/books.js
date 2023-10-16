import { Book } from "../models/book"
import { Profile } from "../models/profile"

import { getBookDetailsById } from '../controllers/google.js'

import { json } from "express"


export async function createComment(req, res) {
  try {
    req.body.commenter = req.user.profile;
    const bookId = req.params.bookId
    const bookDetails = await getBookDetailsById(req, res, bookId)
    Book.comments.push(req.body)
    await book.save()
    const newComment = Book.comments[Book.comments.length - 1]
    const profile = await Profile.findById(req.user.profile)
    newComment.commenter = profile
    res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}