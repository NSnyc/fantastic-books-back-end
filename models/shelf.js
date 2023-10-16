import mongoose from "mongoose"

const Schema = mongoose.Schema

const shelfSchema = new Schema({
  name: String,
  books: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }]
},{
  timestamps: true,
})

const Shelf = mongoose.model('Shelf', shelfSchema)

export { Shelf } 