const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectApi = () => {
    return fs.readFile('./endpoints.json', 'utf-8').then((response) => {
        const result = JSON.parse(response)
        return result;
    })
}