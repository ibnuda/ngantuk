const { DataTypes } = require('sequelize')
const sequelize = require('../dbCon')

const Role = sequelize.define('role', {
    rolename: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false
})

module.exports = Role