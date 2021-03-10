const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    userId: { type: Number, required: true },
    name: { type: String, required: true }
})

const postSchema = new Schema({
    userId: { type: Number, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true }
})

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = {
    User,
    Post
}