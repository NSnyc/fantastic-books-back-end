import { Profile } from '../models/profile.js'
import { v2 as cloudinary } from 'cloudinary'
import { Shelf } from "../models/shelf.js"
import { Book } from "../models/book.js"
import * as googleMiddleware from '../config/helpers.js'

async function index(req, res) {
  try {
    const profiles = await Profile.find({})
    res.json(profiles)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function addPhoto(req, res) {
  try {
    const imageFile = req.files.photo.path
    const profile = await Profile.findById(req.params.id)
    const image = await cloudinary.uploader.upload(
      imageFile, 
      { tags: `${req.user.email}` }
    )
    profile.photo = image.url
    await profile.save()
    res.status(201).json(profile.photo)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function show(req, res){
  try {
    const profile = await Profile.findById(req.params.profileId)
      .populate({
        path: 'shelves',
        select: 'name books',
        populate: {
          path: 'books',
          model: 'Book',
        },
      })
    if(!profile){
      return res.status(404).json({error: 'Profile Not Found'})
    }
    res.status(200).json(profile)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function createShelf(req, res) {
  try {
    const profile = await Profile.findById(req.params.profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile Not Found' })
    }
    if (req.user.profile.toString() !== profile._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const newShelf = new Shelf({ name: req.body.name })
    await newShelf.save()
    profile.shelves.push(newShelf)
    await profile.save()
    res.status(201).json(newShelf)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function showShelves(req, res) {
  try {
    const profileId = req.params.profileId
    const profile = await Profile.findById(profileId).populate({
      path: 'shelves',
      select: 'name books',
      populate: {
        path: 'books',
        model: 'Book',
      },
    })
    if (!profile) {
      return res.status(404).json({ error: 'Profile Not Found' })
    }
    res.status(200).json(profile.shelves)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function editShelf(req, res) {
  try {
    const updatedShelf = await Shelf.findByIdAndUpdate(req.params.shelfId, req.body, { new: true })
    if (!updatedShelf) return res.status(404).json("Shelf not found")
    const profile = await Profile.findOne({ shelves: updatedShelf._id });
    if (req.user.profile.toString() !== profile._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    res.status(200).json(updatedShelf);
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function deleteShelf(req, res) {
  try {
    const deletedShelf = await Shelf.findByIdAndDelete(req.params.shelfId)
    if (!deletedShelf) return res.status(404).json("Shelf not found")

    // Check if the user is the owner of the profile associated with the shelf
    const profile = await Profile.findOne({ shelves: deletedShelf._id });
    if (req.user.profile.toString() !== profile._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await Profile.updateMany(
      { shelves: req.params.shelfId },
      { $pull: { shelves: req.params.shelfId } }
    )
    res.status(200).json(deletedShelf)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function addBookToShelf(req, res) {
  try {
    const profile = await Profile.findById(req.user.profile)
    if (!profile) return res.status(404).send('Profile not found')
    const shelf = await Shelf.findById(req.params.shelfId)
    if (!shelf) return res.status(404).send('Shelf not found')
    if (req.user.profile.toString() !== profile._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    let existingBook = await Book.findOne({ googleId: req.params.volumeId });
    if (existingBook && shelf.books.includes(existingBook._id)) {
      return res.status(400).send('Book already in the shelf')
    }
    const bookDetails = await googleMiddleware.getBookDetailsByIdMiddleware(req.params.volumeId)
    if (!bookDetails) return res.status(404).json({ error: 'Book not found in the Google API' })
    let shelvedBook = await Book.findOne({ googleId: bookDetails.googleId })
    if (!shelvedBook) {
      shelvedBook = new Book({
        title: bookDetails.title || '',
        subtitle: bookDetails.subtitle || '',
        authors: bookDetails.authors || [],
        cover: bookDetails.cover || '',
        published: bookDetails.published || '',
        description: bookDetails.description || '',
        pages: bookDetails.pages || 0,
        categories: bookDetails.categories || [],
        url: bookDetails.url || '',
        googleId: bookDetails.googleId,
      })
      await shelvedBook.save()
    }
    shelf.books.push(shelvedBook._id) // Pushing the ObjectID of the book to the shelf
    await shelf.save()
    const updatedProfile = await Profile.findById(req.params.profileId).populate('shelves')
    if (!updatedProfile) return res.status(404).json({ error: 'Profile Not Found' })
    res.status(200).json(updatedProfile)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export { 
  index, 
  addPhoto, 
  show,
  createShelf,
  showShelves,
  editShelf,
  deleteShelf,
  addBookToShelf
}