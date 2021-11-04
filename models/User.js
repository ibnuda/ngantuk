const { DataTypes, STRING } = require('sequelize')
const sequelize = require('../dbCon')

const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    commentary: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: false
})

module.exports = User