const { checkTopicExists } = require("../models/model-utils")
const db = require("../db/connection")

// beforeEach (() => seed(data))
afterAll (() => db.end())

describe("checkTopicExists", () => {
    test("Returns a Promise", () => {
        const result = checkTopicExists()
        expect(result instanceof Promise).toBe(true)
    })
    test("Returns true if the given topic exists in the topics table", () => {
        const result = checkTopicExists("paper")
        return result
        .then((result) => {
            expect(result).toBe(true)
        })
    })
    test("Returns false if the given topic does not exist in the topics table", () => {
        const result = checkTopicExists(100)
        return result
        .then((result) => {
            expect(result).toBe(false)
        })
    })
})