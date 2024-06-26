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


describe('/api/articles', () => {
    describe('GET articles', () => {
        test('GET 200: should return an array of all articles as objects with the tested keys, in descending date order, without a body property', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body
                    expect(articles.length).toBe(10)
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
    describe('GET query', () => {
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
    describe('GET sorting queries', () => {
        test('GET 200: should be able to sort articles by query and in default order descending', () => {
            return request(app)
                .get('/api/articles?sort_by=author')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body
                    expect(articles).toBeSortedBy('author', {
                        descending: true,
                    })
                })
        })
        test('GET 200: should be able to order a query and in ascending order', () => {
            return request(app)
                .get('/api/articles?order_by=asc')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body
                    expect(articles).toBeSortedBy('created_at', {
                        ascending: true,
                    })
                })
        })
        test('GET 400: should return with an error message for "Bad request" when given a query for a column that doesnt exist', () => {
            return request(app)
                .get('/api/articles?sort_by=most_popular')
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Bad request')
                })

        })
        test('GET 400: should return with an error message for "Bad request" when given an order_by that is invalid', () => {
            return request(app)
                .get('/api/articles?order_by=highest')
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Bad request')
                })

        })
    })
    describe.only('GET pagination', () => {
        test('GET 200: should limit the amount of entries that are recieved when querying', () => {
            return request(app)
                .get('/api/articles?limit=7')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body
                    expect(articles.length).toBe(7)
                })
        })
        test('GET 200: should return the expected article when giving a query limit and page number', () => {
            const expectedResult =   {
                article_id: 2,
                title: 'Sony Vaio; or, The Laptop',
                topic: 'mitch',
                author: 'icellusedkars',
                created_at: "2020-10-16T05:03:00.000Z",
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 0
              }
          
            return request(app)
                .get('/api/articles?limit=1&p=2')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body
                    expect(articles.length).toBe(1)
                    expect(articles[0]).toMatchObject(expectedResult)
                })
        })
    })
    describe('POST articles should be able to post a new article', () => {
        test('POST 200: gives a 200 status and returns an object with the posted article', () => {
            const testToPost = {
                author: "rogersop",
                title: "my life of grime",
                body: "So it all began on a warm summer evening in 1987 Toronto",
                topic: "cats",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            }
            return request(app)
                .post('/api/articles')
                .send(testToPost)
                .expect(200)
                .then(({ body }) => {
                    const { article } = body
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: 14,
                            title: 'my life of grime',
                            topic: 'cats',
                            author: 'rogersop',
                            body: 'So it all began on a warm summer evening in 1987 Toronto',
                            created_at: expect.any(String),
                            votes: 0,
                            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                            comment_count: 0
                        })
                    )
                })
        })
        test('POST 400: should give a error saying "Bad request" if a property has an empty field', () => {
            const testToPost = {
                author: "rogersop",
                title: "my life of grime",
                topic: "cats",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            }
            return request(app)
                .post('/api/articles')
                .send(testToPost)
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Bad request')
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
        test('GET 400 sends a 400 status and error message when given an invalid id', () => {
            return request(app)
                .get('/api/articles/not_an_id_number')
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Bad request');
                });
        });
    })
    describe('GET article by id should now include comment_count property', () => {
        test('When given an article_id, returned object includes a comment_count property', () => {
            const testArticleResult = {
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 2
            }
            return request(app)
                .get('/api/articles/3')
                .expect(200)
                .then(({ body }) => {
                    const { article } = body
                    expect(article).toMatchObject(testArticleResult)
                })
        })
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
    describe('PATCH updates comments votes by comment_id', () => {
        test('PATCH 200: Should respond with a 200 status and the updated comment with new vote value', () => {
            const updateToComment = {
                inc_votes: 10
            }
            const patchedComment = {
                body: " I carry a log — yes. Is it funny to you? It is not to me.",
                votes: -90,
                author: "icellusedkars",
                article_id: 1,
                created_at: "2020-02-23T12:01:00.000Z",
            }
            return request(app)
                .patch("/api/comments/4")
                .send(updateToComment)
                .expect(200)
                .then(({ body }) => {
                    const { comment } = body
                    expect(comment).toMatchObject(patchedComment)
                })
        })
        test('PATCH 404: Should respond with a 404 when presented with a patch request for valid comment_id that is non-existent', () => {
            const updateToComment = {
                inc_votes: 2
            }
            return request(app)
                .patch('/api/comments/777')
                .send(updateToComment)
                .expect(404)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Not found')
                })
        })
        test('PATCH 400: Should respond with a 400 "Bad Request" when presented with a patch request and comment_id is wrong data type', () => {
            const updateToComment = {
                inc_votes: 2
            }
            return request(app)
                .patch('/api/comments/ninezeroninezero')
                .send(updateToComment)
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Bad request')
                })
        })
        test('PATCH 400: Should respond with a 400 "Bad Request" when presented with a patch request and the update data is the wrong type', () => {
            const updateToComment = {
                inc_votes: "two"
            }
            return request(app)
                .patch('/api/comments/3')
                .send(updateToComment)
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Bad request')
                })
        })
    })
    describe('DELETE comments by comment_id', () => {
        test('DELETE 204: Should send a 204 status and delete the comment by the comment_id', () => {
            return request(app)
                .delete("/api/comments/4")
                .expect(204)
        })
        test('DELETE 404: Should send a 404 status if given valid comment_id but it is non-existent', () => {
            return request(app)
                .delete("/api/comments/9090")
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
    describe('GET user by username', () => {
        test('GET 200: selects user by username, presents it as an object and gives 200 status', () => {
            const testUser = {
                username: 'lurker',
                name: 'do_nothing',
                avatar_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
            }
            return request(app)
                .get('/api/users/lurker')
                .expect(200)
                .then(({ body }) => {
                    const { user } = body
                    expect(user).toMatchObject(testUser)
                })
        })
        test('GET 404: returns with message "Not found" if presented with a valid username but is non-existent', () => {
            return request(app)
                .get('/api/users/travis')
                .expect(404)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe('Not found')
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