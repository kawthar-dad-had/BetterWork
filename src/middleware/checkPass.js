const bcrypt = require('bcryptjs')
const Dashboard = require('../models/admin')
const Employee = require('../models/employee')

const checkMiddleware = (Model) => async (req, res, next) => {
    const _id = req.params.id
    try{
        if (Model == Dashboard) {
            //req.token = token
            //req.dashboard = user 
            const dashboard = await Dashboard.findOne({_id})
            const isMatch = await bcrypt.compare(req.body.password, dashboard.password)
            if (!isMatch) {
                throw new Error ('Incorrect password!')
            }       
        } else if (Model == Employee) {
            //req.token = token
            //req.employee = user
            const employee = await Employee.findOne({_id})
            const isMatch = await bcrypt.compare(req.body.password, employee.password)
            if (!isMatch) {
                throw new Error ('Incorrect password!')
            }
        }
        //const user = await Model.findOne({_id})

    //const isMatch = await bcrypt.compare(req.body.password, user.password)

    
    next()

        //console.log(token)
    } catch (e) {
        res.status(401).send({ error: 'Error 401!' })
    }
}

module.exports = checkMiddleware;