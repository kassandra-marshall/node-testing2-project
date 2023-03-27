const db = require('../data/db-config')
const request = require('supertest')
const server = require('./server')
const { getById } = require('./groceries/groceries-model')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db.seed.run()
})

describe('[GET] /groceries', () => {
    test('responds with 200 Ok', async () => {
        const res = await request(server).get('/groceries')
        expect(res.status).toBe(200)
    })
    test('responds with all the grocery items', async () => {
        const res = await request(server).get('/groceries')
        expect(res.body).toHaveLength(3)
    })
})

describe('[POST] /groceries', () => {
    const butter = { name: 'butter'}
    test('adds a grocery item to the database', async () => {
        await request(server).post('/groceries').send(butter)
        expect(await db('groceries')).toHaveLength(4)
    })
    test('responds with the new grocery item', async () => {
        const res = await request(server).post('/groceries').send(butter)
        expect(res.body).toMatchObject(butter)
    })
})

describe('[GET] /groceries/:id', () => {
    test('responds with a 200 Ok', async () => {
        const res = await request(server).get('/groceries/1')
        expect(res.status).toBe(200)
    })
    test('responds with grocery item of given id', async () => {
        const res = await request(server).get('/groceries/1')
        const groceryItem = await getById(1)
        expect(res.body).toMatchObject(groceryItem)
    })
})

describe('[DELETE] /groceries/:id', () => {
    test('responds with a 200 Ok', async () => {
        const res = await request(server).delete('/groceries/1')
        expect(res.status).toBe(200)
    })
    test('deletes grocery item from table', async () => {
        await request(server).delete('/groceries/1')
        const deleted = await getById(1)
        expect(deleted).not.toBeDefined()
    })
})

describe('[PUT] /groceries/:id', () => {
    const butter = { name: 'butter' }
    test('responds with a 200 Ok', async () => {
        const res = await request(server).put('/groceries/1').send(butter)
        expect(res.status).toBe(200)
    })
    test('resolves to updated grocery', async () => {
        const res = await request(server).put('/groceries/1').send(butter)
        expect(res.body).toMatchObject(butter)
    })
})