const { Router } = require('express')
const bcrypt = require('bcryptjs') //Hash passwords
const {check, validationResult} = require('express-validator') //Checking validations
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const router = Router()

//REGISTER USER (/api/auth/register)
router.post(
    '/register',
    //validation-check registration
    [
        check('email', 'Email wrong').isEmail(),
        check('password', 'Minimal password lenght 8 symbols').isLength({ min: 8})
    ],
    async (req, res) => {
    try {
        //Check errors from validation-check
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Registration error'
            })
        }

        //-------REGISTRATION LOGIC START--------
        //Get users emails and passwords
        const {email, password} = req.body
        //Check created users in db
        const candidate = await User.findOne({ email })
        if(candidate) {
            return res.status(400).json({ message: "This user is already registred!"})
        }
        //Hash password, and save new user
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassword })
        await user.save()
        res.status(201).json({ message: "You have successfully registered"})
        //-------REGISTRATION LOGIC END--------


    } catch (e) {
        //Error
        res.status(500).json({ message: "Something went wrong, try again later..."})
    }
    })

//LOGIN USER (/api/auth/login)
router.post(
    '/login',
    //validation-check login
    [
        check('email', 'Incorrect email').normalizeEmail().isEmail(),
        check('password','Enter password').exists()
    ],
    async (req, res) => {
        try {
            //Check errors from validation-check
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Login error'
                })
            }
            //Get users emails and passwords
            const {email, password} = req.body
            //Check created users in db
            const user = await User.findOne({ email })
            if(!user){
                return res.status(400).json({ message: "User not found!"})
            }
            //Password check
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) {
                return res.status(400).json({ message: "Wrong password"})
            }

            //Auth user
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )
            res.json({ token, userId: user.id})

        } catch (e) {
            //Error
            res.status(500).json({ message: "Something went wrong, try again later..."})
        }
    })


module.exports = router;