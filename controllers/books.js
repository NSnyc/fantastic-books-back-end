import { Book } from "../models/book.js"
import { Profile } from "../models/profile.js"
import * as googleMiddleware from '../config/helpers.js'


export async function bookSearch(req, res) {
  try {
    // const bookData = req.bookData;
    const bookData = await googleMiddleware.fetchBooksMiddleware(req.body.searchTerm)
    res.status(200).send(bookData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
export async function getBookDetails(req, res) {
  try {
    const bookDetails = await googleMiddleware.getBookDetailsByIdMiddleware(req.body.volumeId)

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

    const bookDetails = await googleMiddleware.getBookDetailsByIdMiddleware(req.body.volumeId)

    if (!bookDetails) {
      return res.status(404).json({ error: 'Book not found in the Google API' });
    }

    const { text, rating } = req.body

    const newComment = {
      text,
      commenter: req.user.profile,
      rating: rating || 5
    };

    const existingBook = await Book.findOne({ googleId: bookDetails.googleId })

    if (existingBook) {
      existingBook.comments.push(newComment);
      await existingBook.save();
    } else {
      const newBook = new Book({
        title: bookDetails.title ? bookDetails.title : '',
        subtitle: bookDetails.subtitle ? bookDetails.subtitle : '',
        authors : bookDetails.authors ? bookDetails.authors : [],
        cover: bookDetails.cover ? bookDetails.cover : '',
        published: bookDetails.published ? bookDetails.published : '',
        description: bookDetails.description ? bookDetails.description : '',
        pages: bookDetails.pages ? bookDetails.pages : 0,
        categories: bookDetails.categories ? bookDetails.categories : [],
        url: bookDetails.url ? bookDetails.url : '',
        googleId: bookDetails.googleId,
        comments: [newComment]
      });

      await newBook.save();
    }
    console.log('BOOKDETAILS:',bookDetails)
    console.log('comment', newComment)
    
    res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
