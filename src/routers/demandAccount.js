const express = require('express')
const router = new express.Router()
const Employee = require('../models/employee')
const DemandAccount = require('../models/demandAccount')
const auth = require('../middleware/auth')
const multer = require('multer')
const Dashboard = require('../models/admin')

//Dashboard functions
router.post('/demandAccounts', auth(Employee), async (req, res) => {
    const demandAccount = new DemandAccount({
        ...req.body
    })

    try {
        await demandAccount.save()
        res.status(201).send(demandAccount)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get demandAccount by id
router.get('/demandAccount/:id',auth(Dashboard),async (req, res) => {
    const _id = req.params.id
    try {
        const demandAccount = await DemandAccount.find({_id})
        if (!demandAccount) {
            return res.status(404).send()
        }
        res.send(demandAccount)
    }catch (e) {
        res.status(500).send()
    }
})

router.delete('/demandAccounts/:id', auth(Dashboard), async (req, res) => {
    const _id = req.params.id
    try {
        const demandAccount = await DemandAccount.findOneAndDelete({_id})
        if (!demandAccount) {
            return res.status(404).send()
        }
        res.send(demandAccount)
    } catch (e) {
        res.status(500).send()
    }
})

//get demandAccounts by type to show them to visitors
router.get('/demandAccounts', auth(Dashboard), async (req, res) => {
    try {
        const demandAccounts = await DemandAccount.find({})
        if (!demandAccounts) {
            return res.status(404).send()
        }
        res.send(demandAccounts)
    }catch (e) {
        res.status(500).send()
    }
})

module.exports = router