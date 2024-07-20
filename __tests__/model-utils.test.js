const { checkTopicExists, checkExists } = require("../models/model-utils");
const db = require("../db/connection");
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")

beforeEach (() => seed(data))
afterAll(() => db.end());

describe("checkExists", () => {
    test("Returns a Promise", () => {
        const result = checkExists("topics", "slug", "paper");
        expect(result instanceof Promise).toBe(true);
    });
    test("Returns true if the value exists on a given table in a given column", () => {
        const result = checkExists("topics", "slug", "paper")
        return result.then((result) => {
            expect(result).toBe(true)
        })
    })
    // test("Returns false if the given table does not exist", () => {
    //     const result = checkExists("not-a-table", "slug", "paper")
    //     return result.then((result) => {
    //         console.log(result)
    //         expect(result).toBe(false)
    //     })
    // })
    test("Returns false if the value does not exist on a given table in a given column", () => {
        const result = checkExists("topics", "slug", "no-a-value")
        return result.then((result) => {
            expect(result).toBe(false)
        })
    })
});
