const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const request = require('supertest')
const app = require('../app')

beforeAll(() => seed(data));
afterAll(() => db.end)

describe('/api/topics', () => {
    describe('GET topics', () => {
        test('GET 200: should return with an array of objects and status 200 for this endpoint',()=>{ 
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                const { topics } = body
                console.log(topics)
                expect(topics.length).toBe(3)
            })
        })
    })
})