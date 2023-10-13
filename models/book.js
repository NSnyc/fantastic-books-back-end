import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  author: {type: Schema.Types.ObjectId, ref: 'Profile'}
}, {
  timestamps: true
})

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Array,
    required: true,
  },
  cover: {
    type: String,
    required: false,
  },
  published: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
    required: false,
  },
  categories: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  comments: {type: Schema.Types.ObjectId, ref: 'Profile'},
  comments: [commentSchema]
},
  { timestamps: true }
)

const Book = mongoose.model('Book', bookSchema)

export { Book }