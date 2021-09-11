const Post = require('../models/Post');
const User = require('../models/User');
const formidable = require('formidable');
const fs = require('fs');

exports.createPost = async (req, res) => {
    try {
        const { _id } = req.profile;

        let form = formidable.IncomingForm()
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if(err) {
                return res.status(400).json({ msg: err.message });
            }
            const { content, video } = fields;
            
            let post = new Post();
            post.content = content;
            post.ownerId = _id;
            if(video) {
                post.video = video;
            }
            
            if(files.photo){
                
                if(files.photo.size > Math.pow(10,6)) {
                    return res.status(400).json({
                        error: 'Image should be less than 1mb in size !'
                    })
                }
                
                post.photo.data = fs.readFileSync(files.photo.path)
                post.photo.contentType = files.photo.type
            }
        
            post.save((err, post)=>{
                if(err){
                    return res.status(400).json({
                        error: 'post not persist!!!'
                    })
                }
                res.json(post)
            })
            
        })
    } catch (error) {
        return res.status(500).json({error: error});
    }
}

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({error: error});
    }
}

exports.getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if(post) {
            return res.status(200).json({ post })
        }else {
            return res.status(400).json({msg: 'This post does not exist!!!'})
        }
    } catch (err) {
        return res.status(500).json({msg: err});
    }
}

exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(400).json({error: 'This post does not exist!!!'})
        }else if(req.profile._id === post.ownerId) {
            await post.delete();
            return res.status(200).json({msg: 'The post is deleted successfully'})
        }else {
            return res.status(400).json({error: 'Impossible to delete this post'})
        }
    } catch (err) {
        return res.status(500).json({error: err});
    }
}


exports.updatePost = async (req, res) => {
    
}

exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(postId);
        post.likers.push(userId);

        const user = await User.findById(userId);
        
        user.likes.push(postId)

        await post.save();
        await user.save();
        return res.json(post)
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
}

exports.unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userIdUnlike } = req.body;
        const post = await Post.findById(postId);
        console.log(`post ${post}`)
        const index = post.likers.findIndex(liker => liker === postId)
        post.likers.splice(index, 1)

        const user = await User.findById(userIdUnlike);
        console.log(`user ${user}`)
        const indexUnlike = user.likes.findIndex(liker => liker === postId)
        user.likes.splice(indexUnlike, 1)

        await post.save();
        await user.save();
        return res.json(post)
    } catch (err) {
        return res.status(500).json({error: err});
    }
}



exports.getPhoto = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).select('photo')
        
        if(post.photo.data) {
            res.set('Content-Type', post.photo.contentType)
            return res.send(post.photo.data)
        }
        
    } catch (err) {
        return res.status(500).json({error: "error"});
    }
}