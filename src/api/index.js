import app from './config/express'

const port = process.env.P_SEEDER_ENGINE_PORT
app.listen(port, () => console.log('listening on port ' + port))

export default app
