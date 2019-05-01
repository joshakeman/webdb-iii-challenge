const express = require('express')
const helmet = require('helmet')
const knex = require('knex')

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    },
    useNullAsDefault: true
}

const db = knex(knexConfig)

const server = express()

server.use(helmet())
server.use(express.json())

server.get('/', async (req, res) => {
    try {
        const cohorts = await db('cohorts')
        res.status(200).json(cohorts)
    } catch (error) {
        res.status(500).json(error)
    }
})

server.listen(5000, () => 
    console.log(`\n** API running on 5000 **\n`)
)