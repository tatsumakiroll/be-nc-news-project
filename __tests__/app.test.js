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

describe('/api/articles/:article_id', () => {
    describe('GET articles by id', () => {
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
        test('GET 404: sends a 404 status and error message when given a valid but non-existant id', () => {
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
})


describe('General Errors', () => {
    describe('GET non-existant endpoint', () => {
        test('GET 404: should return with an error message saying "not found"', () => {
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