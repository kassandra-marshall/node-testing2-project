const db = require('../../data/db-config');
const Groceries = require('./groceries-model')
const request = require('supertest')
const server = require('../server')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db.seed.run()
})

test('environment is testing', () => {
    expect(process.env.NODE_ENV).toBe('testing')
})

describe('getAll', () => {
    test('resolves all groceries in the table', async () => {
        const result = await Groceries.getAll()
        expect(result).toHaveLength(3)
    })
})

describe('getById', () => {
    test('resolves the grocery item by the given id', async () => {
        let result = await Groceries.getById(1)
        expect(result).toMatchObject({ name: 'eggs' })
        result = await Groceries.getById(2)
        expect(result).toMatchObject({ name: 'milk' })
        result = await Groceries.getById(3)
        expect(result).toMatchObject({ name: 'bread' })
    })
})

describe('insert', () => {
    const butter = { name: 'butter' }
    test('resolves the newly created grocery item', async () => {
        const result = await Groceries.insert(butter)
        expect(result).toMatchObject(butter)
    })
    test('adds the grocery item to the groceries table', async () => {
        await Groceries.insert(butter)
        const records = await db('groceries')
        expect(records).toHaveLength(4)
    })
})

describe('update', () => {
    const butter = { name: 'butter' }
    test('resolves the newly updated grocery item', async () => {
        const result = await Groceries.update(1, butter)
        expect(result).toMatchObject(butter)
    })
    test('adds the changed grocery item to the table', async () => {
        await Groceries.update(1, butter)
        const records = await db('groceries')
        const butterRecord = await Groceries.getById(1)
        expect(records).toHaveLength(3)
        expect(butterRecord).toMatchObject(butter)
    })
})

describe('remove', () => {
    test('grocery item was deleted from table', async () => {
        await request(server).delete('/groceries/1')
        const groceryItem = await db('groceries').where('id', 1).first()
        expect(groceryItem).not.toBeDefined();
    })
})