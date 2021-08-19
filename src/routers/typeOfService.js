const express = require('express')
const router = new express.Router()
const Dashboard = require('../models/admin')
const TypeOfService = require('../models/typeOfService')
const auth = require('../middleware/auth')
const multer = require('multer')
const fs = require('fs')
//const sharp = require('sharp')

//Dashboard functions
router.post('/typeofservice', auth(Dashboard), async (req, res) => {
    const typeOfService = new TypeOfService({
        ...req.body
    })

    try {
        await typeOfService.save()
        res.status(201).send(typeOfService)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get typeOfService by id
router.get('/typeofservice/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const typeOfService = await TypeOfService.find({_id})
        if (!typeOfService) {
            return res.status(404).send()
        }
        res.send(typeOfService)
    }catch (e) {
        res.status(500).send()
    }
})

router.patch('/typeofservice/:id', auth(Dashboard), async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update) )

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try {
        const typeOfService = await TypeOfService.findOne({_id})

        if (!typeOfService) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => typeOfService[update] = req.body[update] )
        await typeOfService.save()

        res.send(typeOfService)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/typeofservice/:id', auth(Dashboard), async (req, res) => {
    const _id = req.params.id
    try {
        const typeOfService = await TypeOfService.findOneAndDelete({_id})
        if (!typeOfService) {
            return res.status(404).send()
        }
        res.send(typeOfService)
    } catch (e) {
        res.status(500).send()
    }
})

//get all typeOfServices to show them to visitors
router.get('/typeofservice', async (req, res) => {
    try {
        const typeOfServices = await TypeOfService.find({})
        if (!typeOfServices) {
            return res.status(404).send()
        }
        res.send(typeOfServices)
    }catch (e) {
        res.status(500).send()
    }
})

module.exports = router