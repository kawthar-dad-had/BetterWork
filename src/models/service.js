const {ObjectID} = require('mongodb')
const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    typeOfService: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'TypeOfService'
    },                                                                                                                                                                                                                                                   
    name: {
        type: String,
        required: true
    },
    part: {
        type: String,
        required: true
    },
    chapter: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
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
    budget: {
        type: Number,
        required: true,
        default: 0
    },
    numPlaces: {
        type: Number,
        default: null
    },
    duration: {
        type: Number,
        default: null
    }
},
{
    timestamps: true
})

serviceSchema.virtual('demands', {
    ref: 'Demand',
    localField: '_id',
    foreignField: 'service'
})

serviceSchema.virtual('grapheservice', {
    ref: 'GrapheService',
    localField: '_id',
    foreignField: 'service'
})
const Service = mongoose.model('Service', serviceSchema)
module.exports = Service