import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  commenter: {type: Schema.Types.ObjectId, ref: 'Profile'},
  rating: {type: Number, min: 1, max: 5, default: 5}
}, {
  timestamps: true
})

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
  authors: {
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
  googleId: {
    type: String,
    required: true,
  },
  comments: [commentSchema]
},
  { timestamps: true }
)

const Book = mongoose.model('Book', bookSchema)

export { Book }