const db = require('../../data/db-config');

function getAll() {
    return db('groceries')
}

function getById(id) {
    return db('groceries')
        .where('id', id)
        .first()
}

async function insert(groceryItem) {
    return await db('groceries').insert(groceryItem).then(([id]) => {
        return db('groceries').where('id', id).first()
    })
}

async function update(id, changes) {
    return await db('groceries').update(changes).where('id', id)
        .then(() => {
            return getById(id)
        })
}

async function remove(id) {
    return await db('groceries').del().where('id', id)
}

module.exports = {
    getAll,
    getById,
    insert,
    update,
    remove
}