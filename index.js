const express = require('express')
const cors = require('cors')

const sequelize = require('./dbCon')
const { notFound, errorHandler } = require('./middleware/errorHandler')
const User = require('./models/User')
const Role = require('./models/Role')
const userRoute = require('./routes/users')

const app = express()

app.use(cors({ credentials: true, origin: true }))

Role.hasMany(User)
User.belongsTo(Role)

const sync = async () => await sequelize.sync({ alter: true })
sync()

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ status: "API is running" });
})
app.use('/api', userRoute)
app.use(notFound)
app.use(errorHandler)
app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`)
})