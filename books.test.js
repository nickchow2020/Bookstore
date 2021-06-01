process.env.NODE_ENV = "test";
const request = require("supertest");
const Book = require("./models/book")
const db = require("./db");
const app = require("./app");


let book ; 


beforeEach(async ()=>{
    const book = {
        "isbn": "101010010100101",
        "amazon_url": "http://amazon.com/eedd",
        "author": "Nick Zhou",
        "language": "english",
        "pages": 200,
        "publisher": "Princeton University",
        "title": "harrypoter",
        "year": 2020
    }
    const result = await Book.create(book)
})



describe("GET /books,books route ",function(){
    test("/books return status", async function(){  
        const res = await request(app).get('/books')

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({"books": 
        [{"amazon_url": "http://amazon.com/eedd", 
        "author": "Nick Zhou", 
        "isbn": "101010010100101", 
        "language": "english", 
        "pages": 200, 
        "publisher": "Princeton University", 
        "title": "harrypoter", "year": 2020}]})
    })
})


describe("POST /books",function(){
    test("/book post good", async ()=>{
        const book = {
            "isbn": "111111000000",
            "amazon_url": "http://amazon.com/",
            "author": "Ste Zhou",
            "language": "english",
            "pages": 200,
            "publisher": "Princeton University",
            "title": "harrypoter",
            "year": 2020
        }

        const res = await request(app).post("/books").send(book)
        expect(res.statusCode).toBe(201)
    })

    test("/book post with Error JSON Schema", async ()=>{
        const book = {
            "amazon_url": "http://amazon.com/",
            "author": "Ste Zhou",
            "language": "english",
            "pages": 200,
            "publisher": "Princeton University",
            "title": "harrypoter",
            "year": 2020
        }

        const res = await request(app).post("/books").send(book)
        expect(res.statusCode).toBe(400)
    })
})

describe("/PUT books",function(){
    test("test Update without error",async()=>{
        const book = {
            "amazon_url": "http://amazon.com/",
            "author": "Ste Zhou",
            "language": "english",
            "pages": 200,
            "publisher": "Princeton University",
            "title": "harrypoter",
            "year": 2020
        }

        const res = await request(app).put("/books/101010010100101").send(book)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            "book": {
              "isbn": "101010010100101",
              "amazon_url": "http://amazon.com/",
              "author": "Ste Zhou",
              "language": "english",
              "pages": 200,
              "publisher": "Princeton University",
              "title": "harrypoter",
              "year": 2020
            }
          })
    })

    test("test Update with error",async()=>{
        const book = {
            "amazon_url": 12344,
            "author": "Ste Zhou",
            "language": "english",
            "publisher": "Princeton University",
            "title": "harrypoter",
            "year": 2020
        }

        const res = await request(app).put("/books/101010010100101").send(book)
        expect(res.statusCode).toBe(400)
    })
})

afterEach(async ()=>{
    await db.query(`DELETE FROM books`)
})


afterAll(async function(){
    await db.end()
})
