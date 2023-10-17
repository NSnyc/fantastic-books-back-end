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

async function update(req, res) {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      req.body,
      { new: true }
    ).populate('blogger')
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId)
    if (blog.blogger.equals(req.user.profile)) {
      await Blog.findByIdAndDelete(req.params.blogId)
      const profile = await Profile.findById(req.user.profile)
      profile.blogs.remove({ _id: req.params.blogId })
      await profile.save()
      res.status(200).json(blog)
    } else {
      throw new Error('Not authorized')
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function createBlogComment(req, res) {
  try {
    req.body.blogCommenter = req.user.profile
    const blog = await Blog.findById(req.params.blogId)
    blog.blogComments.push(req.body)
    await blog.save()
    const newBlogComment = blog.blogComments[blog.blogComments.length - 1]
    const profile = await Profile.findById(req.user.profile)
    newBlogComment.author = profile
    res.status(201).json(newBlogComment)
  } catch (error) {
    res.status(500).json(error)
  }
}

export {
	create,
	index,
	show,
	update,
	deleteBlog as delete,
  createBlogComment,
}