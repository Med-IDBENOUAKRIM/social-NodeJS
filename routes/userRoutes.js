const router = require('express').Router();
const { signup, signin } = require('../controllers/authController');
const { getUsers, getUserInfo, deleteUser, followUser, unfollowUser, getPhoto, updateBioUser, updatePhotoUser } = require('../controllers/userController');
const { isSignIn } = require('../middlewares/auth');
const { validateSignUp, validateSignInInputs } = require('../middlewares/validateAuth');

router.post('/signup', validateSignUp, signup);
router.post('/signin', validateSignInInputs, signin);

router.get('/', getUsers);
router.get('/:userId', isSignIn, getUserInfo);
router.put('/bio/:userId', isSignIn, updateBioUser);
router.put('/photo/v1/:userId', isSignIn, updatePhotoUser);
router.delete('/:userId', isSignIn, deleteUser);
router.patch('/follow/:userId',isSignIn, followUser);
router.patch('/unfollow/:userId',isSignIn , unfollowUser);

router.get('/photo/:userId', getPhoto)


module.exports = router;
