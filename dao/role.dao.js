const Role = require('../model/Role')
module.exports = {
    getRole: async (role) => {
        var country = await Role.F(location.country)
        return City.findAll()
        .then((result) => {
            res = result
            return res
        })
        
    }
}