const router = require('express').Router();

const { isSignIn } = require('../middlewares/auth');
const { createPost, getPosts, getPost, deletePost, updatePost, likePost, unlikePost, getPhoto } = require('../controllers/postController');

router.get('/', getPosts);
router.post('/new', isSignIn, createPost);
router.get('/:postId', getPost);
router.put('/:postId', updatePost);
router.delete('/:postId', isSignIn, deletePost);
router.patch('/like/:postId', isSignIn, likePost);
router.patch('/unlike/:postId', isSignIn, unlikePost);

router.get('/v1/photo/:postId', getPhoto)


module.exports = router;