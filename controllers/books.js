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
    console.log('reqUser:',req.user)
    req.body.commenter = req.user.profile
    // const volumeId = req.params.volumeId
    // const bookDetails = await googleMiddleware.getBookDetailsByIdMiddleware(req, res, volumeId)

    const bookDetails = req.bookDetails;

    if (!bookDetails) {
      return res.status(404).json({ error: 'Book not found in the Google API' });
    }
    const newComment = {
      text: req.body.text,
      commenter: req.user.profile
    }//use the google id to find the book
    //findwhere - query all books in my database to see if this book exists
    //if it does exist push this comment into it
    //if it doesnt create a new book with this data
      //then pass this comment and save
    // pass (add) the book information to the book model
    console.log('BOOKDETAILS:',bookDetails)
    console.log('comment', newComment)
    bookDetails.comments.push(newComment)
    await bookDetails.save()
    res.status(201).json(newComment)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}