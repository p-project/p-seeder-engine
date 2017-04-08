import merge from 'deepmerge'
import fs from 'fs'
import YAML from 'yamljs'

const defaultConfig = {
  pseeder: {
    port: 2342,
    download_path: '/tmp/p-seeder-engine',

    monitor: {
      api: 'localhost:3001/api',
      announce: 'localhost:3001/announce'
    },

    papi: 'localhost:8001/'
  }
}
const homePath = `${process.env.HOME}/.config/p-seeder-engine/config.yml`
const etcPath = '/etc/p-seeder-engine/config.yml'

export default class Config {
  constructor (options) {
    let conf = defaultConfig

    try {
      const fileOverride = YAML.parse(fs.readFileSync(homePath))
      conf = merge(conf, fileOverride)
    } catch (e) {
      try {
        const fileOverride = YAML.parse(fs.readFileSync(etcPath))
        conf = merge(conf, fileOverride)
      } catch (e) {}
    }

    if (options.port !== undefined) {
      conf.port = options.port
    }

    if (options.out !== undefined) {
      conf.download_path = options.out
    }

    for (let prop in conf) {
      this[prop] = conf[prop]
    }
  }
}
