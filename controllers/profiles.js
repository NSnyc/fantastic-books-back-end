import { Profile } from '../models/profile.js'
import { v2 as cloudinary } from 'cloudinary'
import { Shelf } from "../models/shelf.js"

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
    const profileId = req.params.profileId;
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


export { 
  index, 
  addPhoto, 
  show,
  createShelf,
  showShelves,
}
