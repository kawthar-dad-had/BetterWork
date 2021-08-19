const express = require('express')
const router = new express.Router()
const Dashboard = require('../models/admin')
const Document = require('../models/document')
const auth = require('../middleware/auth')

//Dashboard functions
router.post('/documents', auth(Dashboard), async (req, res) => {
    const document = new Document({
        ...req.body
    })

    try {
        await document.save()
        res.status(201).send(document)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/documents/:id', auth(Dashboard), async (req, res) => {
    const _id = req.params.id
    try {
        const document = await Document.findOneAndDelete({_id})
        if (!document) {
            return res.status(404).send()
        }
        res.send(document)
    } catch (e) {
        res.status(500).send()
    }
})

//get all Documents to show them to visitors
router.get('/documents', async (req, res) => {
    try {
        const documents = await Document.find({})
        if (!documents) {
            return res.status(404).send()
        }
        res.send(documents)
    }catch (e) {
        res.status(500).send()
    }
})

module.exports = router