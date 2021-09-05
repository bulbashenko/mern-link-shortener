const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

//Constants
const app = express()
const PORT = config.get('port')

app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use(require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

//Connect to database
async function start(){
    try {
        await mongoose.connect(config.get('mongoURL'), {})
        app.listen(PORT, () => console.log(`Application has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server Error!', e.message)
        process.exit(1)
    }
}
start()
