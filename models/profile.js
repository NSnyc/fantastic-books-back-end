import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name: String,
  photo: String,
  shelves: [{ type: Schema.Types.ObjectId, ref: 'Shelf' }],
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
},{
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
