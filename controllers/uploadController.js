const User = require('../models/User');
const fs = require('fs');
const { promisify } = require('util');
const { uploadError } = require('../utils/HandleErrors/uploadsErrors');
const pipeline = promisify(require('stream').pipeline);

exports.uploadPhoto = async (req, res) => {
    try {
        if(req.file.detectedMimeType != "image/jpg" && req.file.detectedMimeType != "image/png" && req.file.detectedMimeType != "image/jpeg") {
            throw Error("invalid file")
        }

        if(req.file.size > 500000) throw Error("max size");
    } catch (err) {
        const errors = uploadError(err);
        return res.status(500).json({errors})
    }

    const fileName = req.body.name + ".jpg";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../../front-end/public/uploads/profil/${fileName}`
        )
    )

    try {
        await User.findByIdAndUpdate(
            req.profile._id,
            { $set: {photo: "./uploads/profil/"+fileName} },
            {new: true, upsert: true, setDefaultsOnInsert: true},
            (err, data) => {
                if(err || !data) return res.status(500).json({message: err})
                else return res.send(data)
            } 
        )
    } catch (error) {
        return res.status(500).json(error)
    }
}
