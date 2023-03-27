const express = require("express");
const Groceries = require('./groceries/groceries-model')
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: "up" })
});

server.get('/groceries', (req, res) => {
    Groceries.getAll()
        .then(groceries => {
            res.status(200).json(groceries)
        })
        .catch(error => {
            res.status(500).json(error)
        });
});

server.get('/groceries/:id', (req, res) => {
    Groceries.getById(req.params.id)
        .then(groceryItem => {
            res.status(200).json(groceryItem)
        })
        .catch(error => {
            res.status(500).json(error)
        });
});

server.put('/groceries/:id', async (req, res) => {
    const groceryItem = await Groceries.update(req.params.id, req.body)
    res.status(200).json(groceryItem)
});

server.post('/groceries', async (req, res) => {
    res.status(201).json(await Groceries.insert(req.body))
})

server.delete('/groceries/:id', (req, res) => {
    Groceries.remove(req.params.id)
        .then(() => {
            res.status(200).json({ message: "Deletion successful" })
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

module.exports = server;