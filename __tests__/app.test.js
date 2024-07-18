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
    describe("GET Queries", () => {
        test("?sort_by= 200: Responds with all article objects ordered by the column of the given 'sort_by' query", () => {
            return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(13)
                expect(body.articles).toBeSortedBy('title', {descending: true})
            })
        })
        test("?sort_by= 400: Responds with 'Bad request' when the given column name doesn't exist in the table", () => {
            return request(app)
            .get("/api/articles?sort_by=not-a-column")
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
        test("?order= 200: Responds with all article objects ordered by the given 'order' query", () => {
            return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({body})=> {
                expect(body.articles).toHaveLength(13)
                expect(body.articles).toBeSortedBy('created_at')
            })
        })
        test("?order= 400: Responds with 'Bad request' when the 'order' query is anything apart from 'asc' or 'desc'", () => {
            return request(app)
            .get("/api/articles?order=not-an-order")
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
        test("?sort_by=&order= 200: Responds with all article objects with in the given 'order', ordered by the column of the given 'sort_by' query", () => {
            return request(app)
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(13)
                expect(body.articles).toBeSortedBy('title')
            })
        })
        test("?topic= 200: Responds with only the article objects that relate to the given topic", () => {
            return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(12)
                body.articles.forEach((article) => {
                    expect(article.topic).toBe("mitch")
                    expect(article.topic).not.toBe("cats")
                })
            })
        })
        test("?topic= 400: Responds with 'Bad request' when the 'topic' query doesn't exist", () => {
            return request(app)
            .get("/api/articles?topic=not-a-topic")
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
        test("?topic= 200: Responds with an empty array when the 'topic' exists but has no data associated with it", () => {
            return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(0)
                expect(body.articles).toEqual([])
            })
        })
        test("?sort_by=&order=&topic= 200: Responds with only the article objects from the given 'topic', with in the given 'order', ordered by the column of the given 'sort_by' query,", () => {
            return request(app)
            .get("/api/articles?sort_by=title&order=asc&topic=mitch")
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(12)
                expect(body.articles).toBeSortedBy('title')
                body.articles.forEach((article) => {
                    expect(article.topic).toBe("mitch")
                    expect(article.topic).not.toBe("cats")
                })
            })
        })
    })
})

describe("/api/users", () => {
    describe("GET", () => {
        test("GET 200: Responds with an array of all user objects", () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then(({body}) => {
                expect(body.users).toHaveLength(4)
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
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
                expect(body.article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 101,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
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
        test("PATCH 200: Responds with an article objects votes increased by more than 1", () => {
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
        test("PATCH 200: Responds with an article objects votes decreased by more than 1", () => {
            const newVote = {inc_votes: -55}
            return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(200)
            .then(({body}) => {
                expect(body.article.votes).toBe(45)
            })
        })
        test("PATCH 200: Responds with an article objects with it's votes at zero if attempting to reduce the number lower than 0", () => {
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
        //// PATCH A RESOURCE THAT DOESN'T EXIST
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

describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
        test("DELETE 204: Responds with 'No content' if the given comment has been deleted", () => {
            return request(app)
            .delete("/api/comments/1")
            .expect(204)
        })
        test("DELETE 400: Responds with 'Bad request' when given an ID that is not a number", () => {
            return request(app)
            .delete("/api/comments/not-a-number")
            .expect(400)
            .then(({body}) => {
                expect(body).toEqual({message: "Bad request"})
            })
        })
        test("DELETE 404: Responds with a 'Not found' when given an ID that doesn't exist", () => {
            return request(app)
            .delete("/api/comments/999")
            .expect(404)
            .then(({body}) => {
                expect(body).toEqual({message: "Not found"})
            })
        })
        test("DELETE 404: Responds with a 'Not found' when given an ID that is out of range", () => {
            return request(app)
            .delete("/api/comments/9999999999999")
            .expect(404)
            .then(({body}) => {
                expect(body).toEqual({message: "Not found"})
            })
        })
    })
})