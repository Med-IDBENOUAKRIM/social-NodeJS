const User = require('../models/User');
const ObjectID = require("mongoose").Types.ObjectId;
const formidable = require('formidable');
const fs = require('fs')

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-hashed__password -email');
        if(users.length === 0) {
            return res.status(400).json({error: 'No users found!!'});
        }
        return res.json(users)
    } catch (error) {
        return res.status(500).json({ error: error.details[0].message });
    }
}

exports.getUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        if(!ObjectID.isValid(userId)) {
            return res.status(400).json({error: 'id is wrong'})
        }
        const user = await User.findById(userId).select('-hashed__password');
        if(!user) {
            return res.status(400).json({error: 'This user not found!!'});
        }
        return res.json(user)
    } catch (error) {
        return res.status(500).json({ error: error.details[0].message });
    }
}

exports.updateBioUser = async (req, res) => {
    try {

        const { userId } = req.params;
        const { bio } = req.body
            User.findById(userId).exec((err, user) => {
                if(err) {
                    return res.status(400).json({ error: err.message });
                }

            user.bio = bio
            user.save((err, data)=>{
                if(err){
                    return res.status(400).json({
                        error: 'user not persist!!!'
                    })
                }
                data.hash_password = undefined
                res.json(data)
            })
        });

    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

exports.updatePhotoUser = async (req, res) => {
    try {
        const { userId } = req.params;
        User.findById(userId).exec((err, user) => {
            if(err) {
                return res.status(400).json({ error: err.message });
            }
            let form = formidable.IncomingForm()
            form.keepExtensions = true;
            form.parse(req, (err, fields, files) => {
                if(err) {
                    return res.status(400).json({ error: err.message });
                }
            
            if(files.photo){
                
                if(files.photo.size > Math.pow(10,5)) {
                    return res.status(400).json({
                        error: 'Image should be less than 500kb in size !'
                    })
                }
                
                user.photo.data = fs.readFileSync(files.photo.path)
                user.photo.contentType = files.photo.type
            }

            user.save((err, data)=>{
                if(err){
                    return res.status(400).json({
                        error: 'user not persist!!!'
                    })
                }
                data.hash_password = undefined
                res.json(data)
            })
        });
              
        })


    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if(!ObjectID.isValid(userId)) {
            return res.status(400).json({error: 'id is wrong'})
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).json({error: 'This user not found!!'});
        }
        user.remove();
        return res.json({msg: 'Successfully deleted'})

    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

exports.followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { idToFollow } = req.body;

        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { following: idToFollow } },
            { new: true, upsert: true },
            (err, docs) => {
              if (!err) res.status(201).json(docs);
              else return res.status(400).jsos(err);
            }
          );
          
          await User.findByIdAndUpdate(
            idToFollow,
            { $addToSet: { followers: userId } },
            { new: true, upsert: true },
            (err, docs) => {
              if (err) return res.status(400).jsos(err);
            }
          );
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

exports.unfollowUser = async (req, res) => {
    try {
        
        const { userId } = req.params;
        const { idToUnfollow } = req.body;
        
        if(!ObjectID.isValid(userId)) {
            return res.status(400).json({error: 'id is wrong'})
        }

        await User.findOneAndUpdate(
            {
                _id: userId
            },
            { $pull: {
                following: idToUnfollow
            } },
            { new: true, upsert: true },
            (err, data) => {
              if (!err) res.status(201).json(data);
              else return res.status(400).json(err);
            }
            );
            
            await User.findOneAndUpdate(
                {
                    _id: idToUnfollow
                },
                { $pull: { followers: userId } },
                { new: true, upsert: true },
                (err, docs) => {
                
                if (err) return res.status(400).json(err);
            }
        );

    } catch (error) {
        return res.status(500).json({ error: error });
    }
}


exports.getPhoto = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('photo')
        
        if(user.photo.data) {
            res.set('Content-Type', user.photo.contentType)
            return res.send(user.photo.data)
        }
        
    } catch (err) {
        return res.status(500).json({error: "error"});
    }
}