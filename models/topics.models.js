const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectApi = () => {
    return fs.readFile('./endpoints.json', 'utf-8').then((response) => {
        const result = JSON.parse(response)
        return result;
    })
}
exports.selectAllTopics = () => {
    return db.query(`
    SELECT * 
    FROM topics;`)
}

exports.selectArticleById = (article_id) => {
    return db.query(`
    SELECT * 
    FROM articles 
    WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404, message: 'Not found'
                })
            }
            return rows[0]
        })
}
