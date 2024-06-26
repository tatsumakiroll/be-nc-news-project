const db = require('../db/connection')

exports.selectCommentByArticleId = (article_id) => {
    return db.query(`
    SELECT *
    FROM comments
    WHERE article_id=$1`, [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404, message: 'Not found'
            })
        }
        return rows;
    })
}

exports.insertCommentByArticleId = (article_id, newComment) => {
    return db.query(`
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `, [article_id, newComment.username, newComment.body])
    .then(({rows})=>{
        return rows[0]
    })
}

exports.updateCommentById = (updateToComment, comment_id) => {
    return db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
    `, [updateToComment.inc_votes, comment_id])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({
                status: 404, message: 'Not found'
            })
        }
        return rows[0]
    })
}

exports.deleteCommentById = (comment_id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
    `, [comment_id])
    .then(({rows})=>{
        if (rows.length === 0) {
            return Promise.reject({
                status: 404, message: 'Not found'
            })
        }
        return rows[0]
    })
}