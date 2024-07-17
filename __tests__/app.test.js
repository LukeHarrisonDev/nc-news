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
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String)
                    })
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
                expect(body.article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
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
    describe("PATCH", () => {
        test("PATCH 200: Responds with an article object of the given ID", () => {
            const newVote = {inc_votes: 1}
            return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(200)
            .then(({body}) => {
                expect(body.article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
            })
        })
        test("PATCH 200: Responds with an article objects votes incremented by 1", () => {
            const newVote = {inc_votes: 1}
            return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(200)
            .then(({body}) => {
                expect(body.article.votes).toBe(101)
            })
        })
        test("PATCH 200: Responds with an article objects votes incremented by more than 1", () => {
            const newVote = {inc_votes: 102}
            return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(200)
            .then(({body}) => {
                expect(body.article.votes).toBe(202)
            })
        })
        test("PATCH 200: Responds with an article objects votes decremented by 1", () => {
            const newVote = {inc_votes: -1}
            return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(200)
            .then(({body}) => {
                expect(body.article.votes).toBe(99)
            })
        })
        test("PATCH 200: Responds with an article objects votes decremented by more than 1", () => {
            const newVote = {inc_votes: -55}
            return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(200)
            .then(({body}) => {
                expect(body.article.votes).toBe(45)
            })
        })
        test("PATCH 200: Responds with an article objects votes incremented by more than 1", () => {
            const newVote = {inc_votes: -125}
            return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(200)
            .then(({body}) => {
                expect(body.article.votes).toBe(0)
            })
        })

        test("PATCH 400: Responds with 'Bad request' if votes is not a number", () => {
            const newVote = {inc_votes: "not-a-number"}
            return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
        test("PATCH 400: Responds with a 'Bad request' when sending an empty object on the request body", () => {
            return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: "Bad request"})
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
                body.comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    })
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
    describe("POST", () => {
        test("POST 201: Responds with 201 status code and the posted comment", () => {
            const newComment = {
                username: "lurker",
                body: "Hello world"
            }
            return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)
                })
            })
        })
        test("POST 400: Responds with a 'Bad request' when entering an article ID that is not a number", () => {
            const newComment = {
                username: "lurker",
                body: "Hello world"
            }
            return request(app)
            .post("/api/articles/not-a-number/comments")
            .send(newComment)
            .expect(400)
            .then (({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
        test("POST 404: Responds with a 'Not found' when entering an article ID that doesn't exist", () => {
            const newComment = {
                username: "lurker",
                body: "Hello world"
            }
            return request(app)
            .post("/api/articles/99999/comments")
            .send(newComment)
            .expect(404)
            .then (({body}) => {
                expect(body).toEqual({message: "Not found"})
            })
        })
        test("POST 404: Responds with a 'Not found' when entering an article ID that is out of range", () => {
            const newComment = {
                username: "lurker",
                body: "Hello world"
            }
            return request(app)
            .post("/api/articles/9999999999999/comments")
            .send(newComment)
            .expect(404)
            .then(({body}) => {
                expect(body).toEqual({message: "Not found"})
            })
        })
        test("POST 400: Responds with a 'Bad request' when sending an empty object on the request body", () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({})
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
        test("POST 400: Responds with a 'Bad request' when entering a username that doesn't exist", () => {
            const newComment = {
                username: "not-an-existing-user",
                body: "Hello world"
            }
            return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then (({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
        test("POST 400: Responds with a 'Bad request' when sending an empty comment body", () => {
            const newComment = {
                username: "lurker",
                body: ""
            }
            return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
    })
})