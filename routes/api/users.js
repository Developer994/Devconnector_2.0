const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check')

// @route      POST api/users
// @desc       Register user
// @access     Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(), //This line makes sure that the name field is not empty
    check('email', 'Please include a valid email').isEmail(), //isEmail makes sure its a valid email address.
    check('password', 'Please enter a password with 6 or more characters').isLength({
        min: 6
    })
], (req, res) => {
    // console.log(req.body) // <--The object of data that will be sent to this route.
    const errors = validationResult(req)
    if (!errors.isEmpty()) { // Basically, we are inserting the conditions for if there are errors 
        return res.status(400).json({ errors: errors.array() }); //If the user has not entered their name, email address and password correctly, they will get a bad request message.
    }
    res.send('User route');
});

module.exports = router;