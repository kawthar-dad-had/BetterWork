const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: null
    },
    job: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        default: null
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    ccp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    code: {
        type: Number
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
})

employeeSchema.virtual('demands', {
    ref: 'Demand',
    localField: '_id',
    foreignField: 'owner'
})

employeeSchema.methods.toJSON = function () {
    const employee = this
    const employeeObject = employee.toObject()

    delete dashboardObject.code
    delete employeeObject.password
    delete employeeObject.tokens

    return employeeObject
}

employeeSchema.methods.generateAuthToken = async function () {
    const employee = this
    const token = jwt.sign({_id: employee._id.toString()}, process.env.JWT_SECRET)

    employee.tokens = employee.tokens.concat({ token })

    await employee.save()
    return token
}

employeeSchema.statics.findByCredentials = async (email, password) => {
    const employee = await Employee.findOne({email})

    if (!employee) {
        throw new Error ('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, employee.password)

    if (!isMatch) {
        throw new Error ('Unable to login')
    }

    return employee
}

employeeSchema.pre('save', async function(next) {
    const employee = this

    if (employee.isModified('password')) {
        employee.password = await bcrypt.hash(employee.password, 8)
    }

    next()
})

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee