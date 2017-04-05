import merge from 'deepmerge'
import fs from 'fs'

let def = {
  pseeder: {
    port: 2342,
    download_path: '/tmp/p-seeder-engine',

    monitor: {
      api: 'localhost:3001/api',
      announce: 'localhost:3001/announce',
    }
  }
}

const homePath = `${process.env.HOME}/.config/p-seeder-engine/config.yml`
const etcPath = '/etc/p-seeder-engine/config.yml'

if(fs.existsSync(homePath)){
  const configFile = yaml.safeLoad(fs.readFileSync(homePath, 'utf8'))
  def = merge(def, configFile)

} else if(fs.existsSync(etcPath)){
  const configFile = yaml.safeLoad(fs.readFileSync(etcPath, 'utf8'))
  def = merge(def, configFile)

}

export let config = def;

export function setOptions(program){
  if(program.port){
    config.pseeder.port = program.port
  }

  if(program.out){
    config.pseeder.download_path = program.out
  }
}
