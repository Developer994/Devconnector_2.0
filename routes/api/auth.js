const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs');

// @route GET  api/auth
// @desc       Test route
// @access     Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password') //('-password) will leave off the password from the data.
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route      POST api/users
// @desc       Register user
// @access     Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(), //isEmail makes sure its a valid email address.
    check('password', 'Password is required ').exists()
],
    async (req, res) => {
        // console.log(req.body) // <--The object of data that will be sent to this route.
        const errors = validationResult(req)
        if (!errors.isEmpty()) { // Basically, we are inserting the conditions for if there are errors 
            return res.status(400).json({ errors: errors.array() }); //If the user has not entered their name, email address and password correctly, they will get a bad request message.
        }

        // The const below is used for defining multiple values to req.body (Now you can do req.body.name, req.body.email, and req.body.password).
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email })

            // To see if the user exists
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                })
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Sever error')
        }
    });

module.exports = router;