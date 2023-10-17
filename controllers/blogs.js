import { Profile } from "../models/profile.js"
import { Blog } from "../models/blog.js"

async function create(req, res) {
  try {
    req.body.blogger = req.user.profile
    const blog = await Blog.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { blogs: blog } },
      { new: true }
    )
    blog.blogger = profile
    res.status(201).json(blog)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function index(req, res) {
  try {
    const blogs = await Blog.find({})
      .populate('blogger')
      .sort({ createdAt: 'desc' })
    res.status(200).json(blogs)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function show(req, res) {
  try {
    const blog = await Blog.findById(req.params.blogId)
      .populate(['blogger', 'blogComments.blogCommenter'])
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json(error)
  }
}

export {
  create,
  index,
  show,
}