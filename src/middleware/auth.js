const jwt = require('jsonwebtoken')
const Dashboard = require('../models/admin')
const Employee = require('../models/employee')

const auth = (Model) => async (req, res, next) => {
    try{
        //console.log(Model)
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await Model.findOne({_id: decoded._id, 'tokens.token': token})
        //console.log(user)

        if (!user) {
            throw new Error()
        }
        
        if (Model == Dashboard) {
            req.token = token
            req.dashboard = user        
        } else if (Model == Employee) {
            req.token = token
            req.employee = user
        }
        next()

        //console.log(token)
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate!' })
    }
}

module.exports = auth