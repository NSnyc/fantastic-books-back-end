import mongoose from 'mongoose'

const Schema = mongoose.Schema

const blogCommentSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    blogCommenter: { type: Schema.Types.ObjectId, ref: 'Profile' }
  },
  { timestamps: true }
)

const blogSchema = new Schema(
  {
    blogTitle: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    // category: {
    //   type: String,
    //   required: true,
    //   enum: ['News', 'Sports', 'Games', 'Movies', 'Music', 'Television'],
    // },
    blogComments: [blogCommentSchema],
    blogger: { type: Schema.Types.ObjectId, ref: 'Profile' }
  },
  { timestamps: true }
)

const Blog = mongoose.model('Blog', blogSchema)

export { Blog }