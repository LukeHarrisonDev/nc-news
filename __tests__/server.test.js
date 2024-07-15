const request = require("supertest")
const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")

beforeEach (() => seed(data))
afterAll (() => db.end())

describe("/api/topics", () => {
    describe("GET", () => {
        test("GET 200: Responds with a list of topics", () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({body}) => {
                body.topics.forEach((topic) => {
                    expect(topic).toHaveProperty("slug")
                    expect(topic).toHaveProperty("description")
                })
            })
        })

    })
})
