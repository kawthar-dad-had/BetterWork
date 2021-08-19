const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Dashboard = require('../models/admin')
const Employee = require('../models/employee')
const bcrypt = require('bcryptjs')


/*
router.post('/dashboard', async (req, res) => {
    const dashboard = new Dashboard(req.body)

    try {
        await dashboard.save()
        const token = await dashboard.generateAuthToken()
        res.status(201).send({ dashboard, token })
    } catch (e) {
        res.status(400).send(e)
    }
})
*/

router.post('/dashboard/login', async (req, res) => {
    try {
        const dashboard = await Dashboard.findByCredentials(req.body.username, req.body.password)
        const token = await dashboard.generateAuthToken()
        res.send({dashboard, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/dashboard/logout', auth(Dashboard), async (req, res) => {
    try {
        req.dashboard.tokens = req.dashboard.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.dashboard.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/dashboard/logoutall', auth(Dashboard), async (req, res) => {
    try {
        req.dashboard.tokens = []
        await req.dashboard.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
//Update Password
router.patch('/dashboard/:id/password', auth(Dashboard), async (req, res) => {
    const _id = req.params.id
    try {
        const dashboard = await Dashboard.findOne({_id})
        //console.log(dashboard)

        if (!dashboard) {
            return res.status(404).send()
        }
        
        const isMatch = await bcrypt.compare(req.body.password, dashboard.password)
        //console.log(isMatch)
        if (!isMatch) {
            throw new Error ('Incorrect password!')
        }
        
        dashboard.password = req.body.newPassword
        await dashboard.save()

        res.send(dashboard)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/dashboard/forgotPassword/:email', auth(Dashboard), async(req,res) => {
    const code = Math.floor(Math.random()*(1000000-100000)+100000)  
    try {
        const dashboard = await Dashboard.findOne({ email: req.params.email})
        dashboard.code = code
        await dashboard.save()
        sendCode(dashboard.email,code)
        res.send(dashboard)
    } catch (e) {
        res.status(400).send()
    }

})

router.patch('/dashboard/verification/:email', auth(Dashboard), async(req,res) => {
    try {
        const dashboard = await Dashboard.findOne({email: req.params.email})
        if(dashboard.code !== req.body.code){
            res.send('not correct')
        }
        dashboard.password = req.body.password
        await dashboard.save()
        res.send(dashboard)
        
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router