const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('ngantuk', 'iaji', null, {
    dialect: 'postgres',
    host: 'postgres-ngantuk',
    logging: false,
    port: 5432,
    dialectOptions: {}
});

const checkConnection = async () => {
    try {
        console.log('trying to connect');
        await sequelize.authenticate();
        console.log('connected to db');
    } catch (error) {
        console.error('unable to connect to the database:', error);
    }
}

checkConnection()

module.exports = sequelize