const {ObjectID} = require('mongodb')
const mongoose = require('mongoose')

const demandSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Service'
    },                                                                                                                                                                                                                                                   
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Employee'  
    },
    documents: [{
        type: String,
        required: true
    }],
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    state: {
        type: String,
        required: true,
        default:'in progress'
    }
},
{
    timestamps: true
})

const Demand = mongoose.model('Demand', demandSchema)

module.exports = Demand