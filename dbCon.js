const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('ngantuk', 'iaji', 'jaran', {
    dialect: 'postgres',
    host: 'localhost',
    logging: false,
    port: 5432,
    dialectOptions: {}
});

const checkConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('connection has been established successfully.');
    } catch (error) {
        console.error('unable to connect to the database:', error);
    }
}

checkConnection()

module.exports = sequelize