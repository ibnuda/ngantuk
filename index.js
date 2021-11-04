const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')

const swaggerDocument = require('./swagger.json');
const sequelize = require('./dbCon')
const { notFound, errorHandler } = require('./middleware/errorHandler')
const User = require('./models/User')
const Role = require('./models/Role')
const userRoute = require('./routes/users')
const { hashPassword } = require('./utils/password')

const app = express()

app.use(cors({ credentials: true, origin: true }))

Role.hasMany(User)
User.belongsTo(Role, { foreignKey: 'roleName' })

const setupRoles = async () => {
    const existingRoles = await Role.findAll()
    if (existingRoles.length < 1) {
        await Role.create({ name: 'admin' })
    }
}

const setupAdmin = async () => {
    const existingAdmin = await User.findByPk('admin')
    if (!existingAdmin) {
        const hashedPass = await hashPassword('masuk')
        await User.create({
            username: 'admin',
            password: hashedPass,
            commentary: 'ini admin',
            roleName: 'admin'
        })
    }
}

const delay = async () => await new Promise((resolve, reject) => setTimeout(resolve, 1000));

const sync = async () => await sequelize.sync({ alter: true })
sync().then(setupRoles).then(setupAdmin)

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', (req, res) => {
    res.json({ status: "it is running" });
})
app.use('/api', userRoute)
app.use(notFound)
app.use(errorHandler)
app.listen(3000, () => {
    console.log(`running on http://localhost:3000`)
})