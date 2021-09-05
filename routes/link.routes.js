const {Router, request} = require('express')
const config = require('config')
const Link  = require('../models/Link')
const router = Router()
const auth = require('../middleware/auth.middleware')
const shortid = require('shortid')

router.post('/generate', auth, async (req, res) => {
    try {
        const baseURl = config.get('baseURL')
        const {from} = req.body
        const code = shortid.generate()

        const existing  = await Link.findOne({ from })
        if(existing) {
            res.json({ link: existing})
        }

        const to = baseURl + '/' + code
        const link = new Link({
            code, to, from, owner: req.user.userId
        })

        await link.save()
        res.status(201).json({ link })

    } catch (e) {
        //Error
        res.status(500).json({ message: "Something went wrong, try again later..."})
    }
})

router.get('/', auth, async(req, res) => {
    try {
        const links = await  Link.find({ owner: req.user.userId })
        res.json(links)
    } catch (e) {
        //Error
        res.status(500).json({ message: "Something went wrong, try again later..."})
    }

})

router.get('/:id', auth, async(req, res) => {
    try {
        const links = await  Link.findById(req.params.id)
        res.json(links)
    } catch (e) {
        //Error
        res.status(500).json({ message: "Something went wrong, try again later..."})
    }

})


module.exports = router