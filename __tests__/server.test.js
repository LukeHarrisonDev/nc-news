const request = require("supertest")
const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")
const endpoints = require("../endpoints.json")

beforeEach (() => seed(data))
afterAll (() => db.end())

describe("/not-an-endpoint", () => {
    test("GET 404: Responds with 'Not found' if the endpoint doesn't exist", () => {
        return request(app)
        .get("/not-an-endpoint")
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({message: "Not found"})
        })
    })
})

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
        test("GET 200: Responds with an array of all topic objects", () => {
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

describe("/api/articles", () => {
    describe("GET", () => {
        test("GET 200: Responds with an array of all article objects sorted by 'date' by default", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(13)
                expect(body.articles).toBeSortedBy("created_at", {descending: true})
            })
        })
        test("GET 200: Responds with an array of all article objects WITHOUT a body property", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body}) => {
                body.articles.forEach((article) => {
                    expect(article).not.toHaveProperty("body")
                })
            })
        })
        test("GET 200: Responds with an array of all article objects with the fields- author, title, article_id, topic, created_at, votes, article_img_url and a comment count for each article", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body}) => {
                expect(body.articles[0].comment_count).toBe("2")
                expect(body.articles[6].comment_count).toBe("11")
                body.articles.forEach((article) => {
                    expect(article).toHaveProperty("author")
                    expect(article).toHaveProperty("title")
                    expect(article).toHaveProperty("article_id")
                    expect(article).toHaveProperty("topic")
                    expect(article).toHaveProperty("created_at")
                    expect(article).toHaveProperty("votes")
                    expect(article).toHaveProperty("article_img_url")
                    expect(article).toHaveProperty("comment_count")
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
                expect(body.article).toHaveProperty("author")
                expect(body.article).toHaveProperty("title", "Eight pug gifs that remind me of mitch")
                expect(body.article).toHaveProperty("article_id", 3)
                expect(body.article).toHaveProperty("body")
                expect(body.article).toHaveProperty("topic")
                expect(body.article).toHaveProperty("created_at")
                expect(body.article).toHaveProperty("votes")
                expect(body.article).toHaveProperty("article_img_url")
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

describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
        test("GET 200: Responds with an array of all comment objects that relate to the given article_id, sorted by 'date' by default", () => {
            return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toHaveLength(11)
                expect(body.comments).toBeSortedBy("created_at", {descending: true})

            })
        })
        test("GET 200: Responds with an array of all comment objects that relate to the given article_id with the properties of comment_id, votes, created_at, author, body and article_id", () => {
            return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then (({body}) => {
                console.log(JSON.stringify(body))
                body.comments.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id")
                    expect(comment).toHaveProperty("votes")
                    expect(comment).toHaveProperty("created_at")
                    expect(comment).toHaveProperty("author")
                    expect(comment).toHaveProperty("body")
                    expect(comment).toHaveProperty("article_id")
                })
            })
        })
        test("GET 400: Responds with a 'Bad request' when entering an article ID that is not a number", () => {
            return request(app)
            .get("/api/articles/not-a-number/comments")
            .expect(400)
            .then (({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
        test("GET 404: Responds with a 'Not found' when entering an article ID that doesn't exist", () => {
            return request(app)
            .get("/api/articles/99999/comments")
            .expect(404)
            .then (({body}) => {
                expect(body).toEqual({message: "Not found"})
            })
        })
        test("GET 404: Responds with a 'Not found' Error when entering an ID that is out of range", () => {
            return request(app)
            .get("/api/articles/9999999999999/comments")
            .expect(404)
            .then (({body}) => {
                expect(body).toEqual({message: "Not found"})
            })
        })
    })
})