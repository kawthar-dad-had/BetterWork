const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Dashboard = require('../models/admin')
const Employee = require('../models/employee')
const multer = require('multer')
const {sendPassword} = require('../emails/account')
const {sendCode} = require('../emails/forgotPassword')
//const sharp = require('sharp')
/*
const upload = multer ({
    limits: {
        fileSize: 1000000
    },
    fileFilter (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)/)) {
            return cb(new Error('File must be image!'))
        }

        cb(undefined, true)
    }
})
*/

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
    if (!file.originalname.match(/\.(png|jpg|jpeg)/)) {
        return cb(new Error('File must be in pdf format!'))
    }

    cb(undefined, true)
}

const upload = multer({storage: storage, fileFilter: fileFilter})

router.post('/employees', auth(Dashboard), async (req, res) => {
    const employee = new Employee(req.body)
    const precision = 100
    try {      
        sendPassword(employee.email,employee.password)
        await employee.save()
        res.status(201).send({ employee })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/employees/login', async (req, res) => {
    try {
        const employee = await Employee.findByCredentials(req.body.email, req.body.password)
        const token = await employee.generateAuthToken()
        res.send({employee, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/employees/logout', auth(Employee), async (req, res) => {
    try {
        req.employee.tokens = req.employee.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.employee.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/employees/logoutall', auth(Employee), async (req, res) => {
    try {
        req.employee.tokens = []
        await req.employee.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Update password
router.patch('/employees/:id/password', auth(Employee), async (req, res) => {
    const _id = req.params.id
    try {
        const employee = await Employee.findOne({_id})
        //console.log(employee)

        if (!employee) {
            return res.status(404).send()
        }
        
        const isMatch = await bcrypt.compare(req.body.password, employee.password)
        //console.log(isMatch)
        if (!isMatch) {
            throw new Error ('Incorrect password!')
        }
        
        employee.password = req.body.newPassword
        await employee.save()

        res.send(employee)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/employees/modify/:id', auth(Dashboard), async(req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    console.log(updates)
    const allowedUpdates = ['firstname', 'lastname', 'job', 'phoneNumber', 'dateOfBirth', 'ccp', 'email']
    const isValidOperation =updates.every((update) => allowedUpdates.includes(update))
    console.log(isValidOperation)

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const employee = await Employee.findOne({_id})
        console.log(employee)
        updates.forEach((update) => employee[update] = req.body[update])
        console.log(employee)
        await employee.save()

        res.send(employee)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/employees/me/image', auth(Employee), upload.single('image'), async (req, res) => {
    const file = req.file
    
    const filePath = file.patch

    if(!filePath) {
        return res.status(400).send()
    }

    req.employee.image = filePath
    await req.employee.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})


/*router.post('/employees/me/image', auth, upload.single('image'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width:250, height: 250 }).png().toBuffer()
    
    req.employee.image = buffer
    await req.employee.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})
*/
router.get('/employees/:id/image', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
        
        if(!employee || !employee.image) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(employee.image)
    } catch (e) {
        res.status(404).send()
    }
})

router.delete('/employees/me/image', auth(Employee), async (req, res) => {
    try {
        req.employee.image = undefined
        await req.employee.save()
        res.send(req.employee)
    } catch (e) {
        res.status(404).send()
    }
})


router.delete('/employees/:id', auth(Dashboard), async(req, res) => {
    const _id = req.params.id
    try {
        const employee = await Employee.findOneAndDelete({_id})
        if (!employee) {
            return res.status(404).send()
        }
        res.send(employee)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/employees/forgotPassword/:email', auth(Employee), async(req,res) => {
    const code = Math.floor(Math.random()*(1000000-100000)+100000)  
    try {
        const employee = await Employee.findOne({ email: req.params.email})
        employee.code = code
        await employee.save()
        sendCode(employee.email,code)
        res.send(employee)
    } catch (e) {
        res.status(400).send()
    }

})

router.patch('/employees/verification/:email', auth(Employee), async(req,res) => {
    try {
        const employee = await Employee.findOne({email: req.params.email})
        if(employee.code !== req.body.code){
            res.send('not correct')
        }
        employee.password = req.body.password
        await employee.save()
        res.send(employee)
        
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router
