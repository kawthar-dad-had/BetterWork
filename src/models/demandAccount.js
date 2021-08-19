const {ObjectID} = require('mongodb')
const mongoose = require('mongoose')

const demandAccountSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
},
{
    timestamps: true
})

const DemandAccount = mongoose.model('DemandAccount', demandAccountSchema)

module.exports = DemandAccount