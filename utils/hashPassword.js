const bcrypt = require('bcryptjs');

exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        return res.status(500).json({ msg: err });
    }
}