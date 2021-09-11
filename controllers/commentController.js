const Post = require('../models/Post');

exports.createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const { commenterId } = req.body;
        const { username } = req.profile;

        const post = await Post.findById(postId);
        if(post) {
                post.comments.unshift({
                       commenterId,
                       owner: username,
                       text, 
                       timestamp: new Date().getTime()
                    })
            await post.save();
            return res.status(200).json(post);
        }else {
            return res.status(400).json({error: 'This post does not exist!!!'})
        }
    } catch (err) {
        throw err;
    }
}

exports.updateComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { commentId } = req.body;
        const { text } = req.body;

        const post = await Post.findById(postId);
        if(post) {
            const targetComment = post.comments.find(comment => comment._id.equals(commentId));
            if(!targetComment) {
                return res.status(400).json({error: 'comment not found'})
            }
            targetComment.text = text;
            await post.save();
            return res.status(200).json(post);
        }else {
            return res.status(400).json({error: 'This post does not exist!!!'})
        }
    } catch (err) {
        throw err;
    }
}

exports.removeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { postId } = req.params;
        const { username } = req.profile;

        const post = await Post.findById(postId);
        if(post) {
            const commentIndex = await post.comments.findIndex(comm => comm.id === commentId);
            if(commentIndex === -1 ) {
                return res.status(400).json({error: 'This comment does not exist!!!'})
            }else if(post.comments[commentIndex].owner === username) {
                post.comments.splice(commentIndex, 1);
                await post.save();
                return res.status(200).json(post);
            }else {
                return res.status(400).json({error: 'Impossible to delete this comment!!'})
            }
        }else {
            return res.status(400).json({msg: 'This post does not exist!!!'})
        }

    } catch (err) {
        throw err;
    }
}
