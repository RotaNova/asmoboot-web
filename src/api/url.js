import merge from 'lodash/merge'

let _defaultConfig = {
    development: {
        backEndUrl: `http://192.168.0.197:8899`,
        websockUrl: ``,
        httpPrefix: `api`
    },
    production: {
        backEndUrl: `http://192.168.0.197:8899`,
        websockUrl: ``,
        httpPrefix: `api`
    }
}


let _env = (process.env.NODE_ENV || 'production').toLowerCase()

console.log(_defaultConfig)
let envConfig = _env === 'production' ? _defaultConfig.production : _defaultConfig.development

console.log(`当前环境：${_env}`)

export default merge(
    envConfig,
    {
        env: _env
    })