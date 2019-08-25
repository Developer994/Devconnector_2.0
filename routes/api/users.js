const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const { check, validationResult } = require('express-validator/check')
const User = require('../../models/User');
const bcrypt = require('bcryptjs')

// @route      POST api/users
// @desc       Register user
// @access     Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(), //This line makes sure that the name field is not empty
    check('email', 'Please include a valid email').isEmail(), //isEmail makes sure its a valid email address.
    check('password', 'Please enter a password with 6 or more characters').isLength({
        min: 6
    })
],
    async (req, res) => {
        // console.log(req.body) // <--The object of data that will be sent to this route.
        const errors = validationResult(req)
        if (!errors.isEmpty()) { // Basically, we are inserting the conditions for if there are errors 
            return res.status(400).json({ errors: errors.array() }); //If the user has not entered their name, email address and password correctly, they will get a bad request message.
        }

        // The const below is used for defining multiple values to req.body (Now you can do req.body.name, req.body.email, and req.body.password).
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email })

            // To see if the user exists
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            // Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200', // size
                r: 'pg', // rating
                d: 'mm' // Default
            })

            // Here, we create a new instance for user
            user = new User({
                name,
                email,
                avatar,
                password
            })

            // Encrypt password -> We need to encrypt the password before saving the new User to the database
            const salt = await bcrypt.genSalt(10); //The 10 in the parentesis is called the rounds(the more you have the more secure, but it makes the process slower.)

            user.password = await bcrypt.hash(password, salt)

            await user.save(); // Put await in front of anything that returns a promise 

            // Return jsonwebtoken

            res.send('User Registered');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Sever error')
        }
    });

module.exports = router;