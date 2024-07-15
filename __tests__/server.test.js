const request = require("supertest")
const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")
const endpoints = require("../endpoints.json")

beforeEach (() => seed(data))
afterAll (() => db.end())

describe("/api", () => {
    describe("GET", () => {
        test("GET 200: Responds with the endpoints.json file", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({body}) => {
                expect(body.endpoints).toEqual(endpoints)
            })
        })
    })
})

describe("/api/topics", () => {
    describe("GET", () => {
        test("GET 200: Responds with a list of topics", () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({body}) => {
                expect(body.topics).toHaveLength(3)
                body.topics.forEach((topic) => {
                    expect(topic).toHaveProperty("slug")
                    expect(topic).toHaveProperty("description")
                })
            })
        })
    })
})

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        test("GET 200: Responds with an article with the given ID from the endpoint", () => {
            return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({body}) => {
                expect(body.article[0]).toHaveProperty("author")
                expect(body.article[0]).toHaveProperty("title", "Eight pug gifs that remind me of mitch")
                expect(body.article[0]).toHaveProperty("article_id", 3)
                expect(body.article[0]).toHaveProperty("body")
                expect(body.article[0]).toHaveProperty("topic")
                expect(body.article[0]).toHaveProperty("created_at")
                expect(body.article[0]).toHaveProperty("votes")
                expect(body.article[0]).toHaveProperty("article_img_url")
            })
        })
        test("GET 400: Responds with a 'Bad request' Error when entering an ID that is not a number", () => {
            return request(app)
            .get("/api/articles/not-a-number")
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
        test("GET 404: Responds with a 'Not found' Error when entering an ID that does not exist", () => {
            return request(app)
            .get("/api/articles/99999")
            .expect(404)
            .then(({body}) => {
                expect(body).toEqual({message: "Not found"})
            })
        })
        test("GET 404: Responds with a 'Not found' Error when entering an ID that is out of range", () => {
            return request(app)
            .get("/api/articles/9999999999999")
            .expect(404)
            .then(({body}) => {
                expect(body).toEqual({message: "Not found"})
            })
        })
    })
})