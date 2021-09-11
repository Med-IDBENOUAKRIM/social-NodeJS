const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    ownerId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    video: {
        type: String,
    },
    likers: {
      type: [String],
      required: true,
    },
    comments: {
      type: [
        {
          commenterId: String,
          owner: String,
          text: String,
          timestamp: Number,
        }
      ],
      required: true,
    },
  },{ timestamps: true });

module.exports = model('Post', postSchema);