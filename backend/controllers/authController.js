const axios = require('axios');
const jwt = require('jsonwebtoken');
const { oauth2Client } = require('../utils/googleClient');
const User = require('../models/userModel');

/* GET Google Authentication API. */
exports.googleAuth = async (req, res, next) => {
    const code = req.query.code;
    try {
        // Exchange the authorization code for tokens
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);

        // Fetch user information from Google
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        const { email, name, picture } = userRes.data;

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture,
            });
        } else {
            // Update user info if it exists
            user.name = name;
            user.image = picture;
            await user.save();
        }

        const { _id } = user;

        // Generate JWT token
        const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response back to client
        res.status(200).json({
            message: 'success',
            user: {
                token,
                _id: user._id,
                email: user.email,
                name: user.name,
                image: user.image
            },
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};
