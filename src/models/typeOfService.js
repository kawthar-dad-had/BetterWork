const mongoose = require('mongoose')

const typeOfServiceSchema = new mongoose.Schema({                                                                                                                                                                                                                                                   
    name: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true,
        default: 0
    },
})


typeOfServiceSchema.virtual('graphetos', {
    ref: 'GrapheTOS',
    localField: '_id',
    foreignField: 'typeOfService'
})

typeOfServiceSchema.virtual('grapheservice', {
    ref: 'GrapheService',
    localField: '_id',
    foreignField: 'typeOfService'
})

typeOfServiceSchema.virtual('services', {
    ref: 'Service',
    localField: '_id',
    foreignField: 'typeOfService'
})

const TypeOfService = mongoose.model('TypeOfService', typeOfServiceSchema)

module.exports = TypeOfService