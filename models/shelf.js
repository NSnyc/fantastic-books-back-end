import mongoose from "mongoose"

const { Schema, model } = mongoose

const shelfSchema = new Schema({
  name: String,
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
}, {
  timestamps: true,
})

const Shelf = model('Shelf', shelfSchema)

export { Shelf }