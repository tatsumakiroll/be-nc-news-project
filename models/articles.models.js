const db = require('../db/connection')

exports.selectAllArticles = (sort_by = 'created_at', order_by = "desc", topic) => {
    const validSortBys = ['author', 'title', 'topic', 'votes', 'created_at']
    const validOrderBys = ['asc', 'desc']
    const queryValues = []

    let sqlQueryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id `

    if (!validSortBys.includes(sort_by) || !validOrderBys.includes(order_by)) {
        return Promise.reject({ status: 400, message: 'Bad request' })
    }

    if (topic) {
        queryValues.push(topic)
        sqlQueryString += `WHERE topic=$1 `
    }

    sqlQueryString += `GROUP BY articles.article_id `
    sqlQueryString += `ORDER BY ${sort_by} `
    sqlQueryString += `${order_by}`.toUpperCase()

    return db.query(sqlQueryString, queryValues)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404, message: 'Not found'
                })
            }
            return rows;
        })
}

exports.insertArticle = (newArticle) => {
    const { author, title, body, topic, article_img_url } = newArticle
    if (author === undefined || title === undefined || body === undefined || topic === undefined){
        return Promise.reject({status:400, message: 'Bad request'})
    }
        return db.query(`
    INSERT INTO articles
    (author, title, body, topic, article_img_url)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *
    `, [author, title, body, topic, article_img_url])
            .then(({ rows }) => {
                const newArticleId = rows[0].article_id
                return db.query(`
            SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, 
            COUNT(comments.article_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id
            `, [newArticleId])
                    .then(({ rows }) => {
                        return rows[0]
                    })
            })
}

exports.selectArticleById = (article_id) => {
    return db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404, message: 'Not found'
                })
            }
            return rows[0]
        })
}

exports.updateArticle = (updateToArticle, article_id) => {
    return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `, [updateToArticle.inc_votes, article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404, message: 'Not found'
                })
            }
            return rows[0]
        })
}