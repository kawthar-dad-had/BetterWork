const express = require('express')
const router = new express.Router()
const Employee = require('../models/employee')
const Demand = require('../models/demand')
const auth = require('../middleware/auth')
const Dashboard = require('../models/admin')
const multer = require('multer')
const {sendEmail} = require('../emails/sendemail')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdir('./uploads/',(err)=>{
        cb(null, './uploads/')
        })
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    },
})

const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf)/)) {
        return cb(new Error('File must be in pdf format!'))
    }

    cb(undefined, true)
}

const upload = multer({storage: storage, fileFilter: fileFilter})

//Dashboard functions
router.post('/demands', auth(Employee), upload.array('documents', 10), async (req, res) => {
    const files = req.files
    let i = 0
    console.log(files)
    const filesPath = []
    files.forEach(file => {
        filesPath[i] = file.path
        i++
    })
    //console.log(filesPath)
    if(!filesPath) {
        return res.status(400).send()
    }

    const demand = new Demand({
        ...req.body,
        documents: filesPath
    })

    try {
        await demand.save()
        res.status(201).send(demand)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get demand by id
router.get('/demand/:id',auth(Dashboard),async (req, res) => {
    const _id = req.params.id
    try {
        const demand = await Demand.find({_id}).populate({ path: 'service', model: 'Service'}).populate({ path: 'owner', model: 'Employee'})
        if (!demand) {
            return res.status(404).send()
        }
        res.send(demand)
    }catch (e) {
        res.status(500).send()
    }
})

router.delete('/demands/:id', auth(Dashboard), async (req, res) => {
    const _id = req.params.id
    try {
        const demand = await Demand.findOneAndDelete({_id})
        if (!demand) {
            return res.status(404).send()
        }
        res.send(demand)
    } catch (e) {
        res.status(500).send()
    }
})

//get demands by name of service to show them to visitors
router.get('/demands/service/:service', auth(Dashboard), async (req, res) => {
    const service = req.params.service
    try {
        const demands = await Demand.find({service}).populate({path: 'owner', model: 'Employee'})
        if (!demands) {
            return res.status(404).send()
        }
        res.send(demands)
    }catch (e) {
        res.status(500).send()
    }
})
//get demand by state
router.get('/demand/state/:state',auth(Dashboard),async (req, res) => {
    const state= req.params.state
    try {
        const demand = await Demand.find({state}).populate({path: 'owner', model: 'Employee'}).populate({path: 'service', model: 'Service'})
        if (!demand) {
            return res.status(404).send()
        }
        res.send(demand)
    }catch (e) {
        res.status(500).send()
    }
})

router.patch('/demand/:id', auth(Dashboard), async (req,res) => {
    try {
     const demand = await Demand.findOne({_id: req.params.id}).populate({path: 'owner', model: 'Employee'}).populate({path: 'service', model: 'Service'})
     console.log(demand)
     demand.state = req.body.state
     await demand.save()
     sendEmail(demand.owner.email,demand.owner.firstname,demand.service.name,demand.state)
     res.status(200).send()
    }catch (error) {
     res.status(500).send()
    }
   });

module.exports = router