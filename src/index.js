#!/usr/bin/env node

import app from './config/express'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.P_SEEDER_ENGINE_PORT
app.listen(port, () => console.log('listening on port ' + port))

export default app
