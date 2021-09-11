const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../utils/hashPassword');
const { comparePassword } = require('../utils/comparePassword');
const { signUpErrors } = require('../utils/HandleErrors/signUpErrors');

exports.signup = async (req, res) => {
    try {

        const { username, email, password } = req.body;
        const photoDefault = {
            data: "https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_200x200.jpg",
            ContentType: "default"
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({ 
                username, 
                email, 
                hashed__password: hashedPassword, 
                createdAt: new Date().toISOString(),
                photo: photoDefault
             })
        req.user = newUser;
        return res.status(200).json({
            msg: 'signup is success with no problem',
        })

    } catch (error) {
        return res.status(500).json({ error: signUpErrors(error) })
    }
}

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({error: 'email is incorrect!!'});
        }

        const isPassword = await comparePassword(user.hashed__password, password);
        if(!isPassword) {
            return res.status(400).json({ error: 'your password is incorrect !'});
        }
        
        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET);
        res.cookie('token', token, { expire: new Date() + 9878540 });

        const {_id, username} = user;
        return res.status(200).json({
            token,
            user: {_id, username}
        });

    } catch (error) {
        return res.status(500).json({ error: error.details[0].message });
    }
}

