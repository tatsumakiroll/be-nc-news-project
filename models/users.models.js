const db = require('../db/connection')

exports.selectAllUsers = () => {
    return db.query(`
    SELECT * 
    FROM users;`)
        .then(({ rows }) => {
            return rows
        })
}

exports.selectUserByName = (username) => {
    return db.query(`
    SELECT * 
    FROM users
    WHERE username=$1`, [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404, message: 'Not found'
                })
            }
            return rows[0]
        })
}