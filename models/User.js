const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    hashed__password: String,
    photo: {
        data: Buffer,
        contentType: String,
      },
    bio :{
        type: String,
        max: 1025,
    },
    followers: {
        type: [String]
    },
    following: {
        type: [String]
    },
    likes: {
        type: [String]
    }
}, { timestamps: true } )

module.exports = model('User', userSchema);