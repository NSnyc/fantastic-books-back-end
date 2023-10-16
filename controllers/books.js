import { Book } from "../models/book.js"
import { Profile } from "../models/profile.js"
import * as googleMiddleware from '../middleware/helper.js'


export async function bookSearch(req, res) {
  try {
    const bookData = req.bookData;
    res.status(200).send(bookData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
export async function getBookDetails(req, res) {
  try {
    const bookDetails = req.bookDetails;

    if (!bookDetails) {
      return res.status(404).json({ error: 'Book not found in the Google API' });
    }

    res.status(200).json(bookDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

export async function createComment(req, res) {
  try {
    req.body.commenter = req.user.profile
    const volumeId = req.params.volumeId
    const bookDetails = await getBookDetailsById(req, res, volumeId)

    if (!bookDetails) {
      return res.status(404).json({ error: 'Book not found in the Google API' });
    }
    const newComment = {
      text: req.body.text,
      commenter: req.user.profile
    }
  
    bookDetails.comments.push(newComment)
    await bookDetails.save()
    res.status(201).json(newComment)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}