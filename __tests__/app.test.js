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

describe('General Errors', () => {
    describe('GET non-existant endpoint', () => {
        test('GET 404: should return with an error message saying "not found"', () => {
            return request(app)
                .get('/api/topix')
                .expect(404)
                .then(({body}) => {
                   const {message} =body
                expect(message).toBe('not found')
                })
        })
    })
})