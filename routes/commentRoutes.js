const router = require('express').Router();
const { createComment, updateComment, removeComment } = require('../controllers/commentController');
const { isSignIn } = require('../middlewares/auth');

router.patch('/new/:postId', isSignIn, createComment);
router.patch('/:postId', isSignIn, updateComment);
router.delete('/:postId/:commentId', isSignIn, removeComment);

module.exports = router;