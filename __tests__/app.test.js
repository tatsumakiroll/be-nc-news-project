const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const request = require('supertest')
const app = require('../app')
const endpoints = require('../endpoints.json')


beforeAll(() => seed(data));
afterAll(() => db.end)


describe('/api', () => {
    describe('GET api', () => {
        test('GET 200: should return an object describing all other endpoints', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({ body }) => {
                    expect(body).toEqual({ availableApi: endpoints })
                })
        })
    })
})


describe('/api/topics', () => {
    describe('GET topics', () => {
        test('GET 200: should return with an array of objects and status 200 for this endpoint', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    const { topics } = body
                    expect(topics.length).toBe(3)
                    topics.forEach(topic => {
                        expect(typeof topic.slug).toBe('string')
                        expect(typeof topic.description).toBe('string')
                    })
                })
        })
    })
})


describe.only('/api/articles', () => {
    describe('GET articles', () => {
        test('GET 200: should return an array of all articles as objects with the tested keys, in descending date order, without a body property', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body
                    expect(articles.length).toBe(13)
                    articles.forEach((article) => {
                        expect(article).toHaveProperty('author')
                        expect(article).toHaveProperty('title')
                        expect(article).toHaveProperty('article_id')
                        expect(article).toHaveProperty('topic')
                        expect(article).toHaveProperty('created_at')
                        expect(article).toHaveProperty('votes')
                        expect(article).toHaveProperty('article_img_url')
                        expect(article).toHaveProperty('comment_count')
                        expect(article).not.toHaveProperty('body')
                    })
                    expect(articles).toBeSortedBy('created_at', {
                        descending: true,
                    })
                })
        })
    })
    describe('GET 404 query', () => {
        test('GET 200: should be able to accept a query for topics, if no query it should default to all', () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body
                expect(articles.length).toBe(1)
                expect(articles[0].topic).toBe('cats')
            })
        })
        test('GET 404: if presented with a valid query but the topic doesnt exist should respond with 404 "Not found"', () => {
            return request(app)
                .get('/api/articles?topic=world_news')
                .expect(404)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Not found')
                })
        })
    })
})


describe('/api/articles/:article_id', () => {
    describe('GET articles by article_id', () => {
        test('GET 200: should return an object of the article that corresponds with the id input as parameter', () => {
            return request(app)
                .get('/api/articles/2')
                .expect(200)
                .then(({ body }) => {
                    const { article } = body
                    expect(article.article_id).toBe(2)
                    expect(article.title).toBe('Sony Vaio; or, The Laptop')
                    expect(article.topic).toBe('mitch')
                    expect(article.author).toBe('icellusedkars')
                    expect(article.created_at).toBe('2020-10-16T05:03:00.000Z')
                    expect(article.body).toBe('Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.')
                    expect(article.votes).toBe(0)
                    expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
                })
        })
        test('GET 404: sends a 404 status and error message when given a valid but non-existent id', () => {
            return request(app)
                .get('/api/articles/999')
                .expect(404)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Not found')
                })
        })
        test('GET:400 sends a 400 status and error message when given an invalid id', () => {
            return request(app)
                .get('/api/articles/not_an_id_number')
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Bad request');
                });
        });
    })
    describe('PATCH update an article by article_id', () => {
        test('PATCH 200: Should respond with 200 and show the updated article', () => {
            const updateToArticle = {
                inc_votes: 2
            }
            return request(app)
                .patch('/api/articles/3')
                .send(updateToArticle)
                .expect(200)
                .then(({ body }) => {
                    const { article } = body
                    expect(article.votes).toBe(2)
                })
        })
        test('PATCH 404: Should respond with a 404 when presented with a patch request for valid article_id that is non-existent', () => {
            const updateToArticle = {
                inc_votes: 2
            }
            return request(app)
                .patch('/api/articles/777')
                .send(updateToArticle)
                .expect(404)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Not found')
                })
        })
        test('PATCH 400: Should respond with a 400 "Bad Request" when presented with a patch request and article_id is wrong data type', () => {
            const updateToArticle = {
                inc_votes: 2
            }
            return request(app)
                .patch('/api/articles/sevensevenseven')
                .send(updateToArticle)
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Bad request')
                })
        })
        test('PATCH 400: Should respond with a 400 "Bad Request" when presented with a patch request and the update data is the wrong type', () => {
            const updateToArticle = {
                inc_votes: "two"
            }
            return request(app)
                .patch('/api/articles/3')
                .send(updateToArticle)
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Bad request')
                })
        })
    })
})


describe('/api/articles/:article_id/comments', () => {
    describe('GET comments using article_id parametric endpoint', () => {
        test('GET 200: should return with an array of comments applicable to the article_id presented', () => {
            return request(app)
                .get('/api/articles/9/comments')
                .expect(200)
                .then(({ body }) => {
                    const { comments } = body
                    expect(comments.length).toBe(2)
                })
        })
        test('GET 400: will return a 400 status and a message saying "Bad Request" if not given a number', () => {
            return request(app)
                .get('/api/articles/not_a_number/comments')
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Bad request')
                })
        })
        test('GET 404: will return a 404 status and a message saying "Not found" if given a valid id that is non-existent', () => {
            return request(app)
                .get('/api/articles/999/comments')
                .expect(404)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Not found')
                })
        })
    })
    describe('POST: Add comments to an article using article_id parametric endpoint', () => {
        test('POST 201: will post the comment and return with the added comment', () => {
            const newComment = {
                username: "rogersop",
                body: "Hello?! Is this thing on?"
            }
            return request(app)
                .post('/api/articles/6/comments')
                .send(newComment)
                .expect(201)
                .then(({ body }) => {
                    const { comment } = body
                    expect(comment.author).toBe("rogersop")
                    expect(comment.body).toBe("Hello?! Is this thing on?")
                })
        })
        test('POST 400: will fail to post if any fields are empty and return message "Bad Request"', () => {
            const newComment = {
                username: "rogersop",
            }
            return request(app)
                .post('/api/articles/6/comments')
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe("Bad request")
                })
        })
        test('POST 404: will fail to post if valid article_id is entered but is non-existent', () => {
            const newComment = {
                username: "rogersop",
                body: "Can anyone hear me?"
            }
            return request(app)
                .post('/api/articles/999/comments')
                .send(newComment)
                .expect(404)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe("Not found")
                })
        })
    })
})


describe('/api/comments/:comment_id', () => {
    describe('DELETE comments by comment_id', () => {
        test('DELETE 204: Should send a 204 status and delete the comment by the comment_id', () => {
            return request(app)
                .delete("/api/comments/4")
                .expect(204)
        })
        test('DELETE 404: Should send a 404 status if given valid comment_id but it is non-existent', () => {
            return request(app)
                .delete("/api/comments/666")
                .expect(404)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe("Not found")
                })
        })
        test('DELETE 400: Should send a 400 status if given an invalid comment_id', () => {
            return request(app)
                .delete("/api/comments/sixsixsix")
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe("Bad request")
                })
        })
    })
})

describe('/api/users', () => {
    describe('GET all users', () => {
        test('GET 200: returns with an array of all users presented as objects and a 200 status', () => {
            const testUser = {
                username: 'rogersop',
                name: 'paul',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
            }

            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({ body }) => {
                    const { users } = body
                    expect(users.length).toBe(4)
                    expect(users[2]).toMatchObject(testUser)
                })
        })
    })
})
describe('General Errors', () => {
    describe('GET non-existant endpoint', () => {
        test('GET 404: should return with an error message saying "Not found"', () => {
            return request(app)
                .get('/api/topix')
                .expect(404)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Not found')
                })
        })
    })
})