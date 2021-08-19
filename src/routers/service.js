const express = require('express')
const router = new express.Router()
const Dashboard = require('../models/admin')
const Service = require('../models/service')
const auth = require('../middleware/auth')
const multer = require('multer')
//const sharp = require('sharp')

//Dashboard functions
router.post('/services', auth(Dashboard), async (req, res) => {
    const service = new Service({
        ...req.body
    })

    try {
        await service.save()
        res.status(201).send(service)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get service by id
router.get('/services/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const service = await Service.find({_id}).populate({path: 'typeOfService', model: 'TypeOfService'})
        if (!service) {
            return res.status(404).send()
        }
        res.send(service)
    }catch (e) {
        res.status(500).send()
    }
})
//get service by name
router.get('/service/:name', async (req, res) => {
    const name = req.params.name
    try {
        const service = await Service.find({name}).populate({path: 'typeOfService', model: 'TypeOfService'})
        if (!service) {
            return res.status(404).send()
        }
        res.send(service)
    }catch (e) {
        res.status(500).send()
    }
})

router.patch('/services/:id', auth(Dashboard), async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'part', 'chapter', 'description','link','documents', 'budget', 'numPlaces', 'amount', 'duration' ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update) )

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try {
        const service = await Service.findOne({_id})

        if (!service) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => service[update] = req.body[update] )
        await service.save()

        res.send(service)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/services/:id', auth(Dashboard), async (req, res) => {
    const _id = req.params.id
    try {
        const service = await Service.findOneAndDelete({_id})
        if (!service) {
            return res.status(404).send()
        }
        res.send(service)
    } catch (e) {
        res.status(500).send()
    }
})

//get services by type to show them to visitors
router.get('/services/type/:type', async (req, res) => {
    const typeOfService = req.params.type
    try {
        const services = await Service.find({typeOfService})
        if (!services) {
            return res.status(404).send()
        }
        res.send(services)
    }catch (e) {
        res.status(500).send()
    }
})

module.exports = router