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

server.get('/api/cohorts', async (req, res) => {
    try {
        const cohorts = await db('cohorts')
        res.status(200).json(cohorts)
    } catch (error) {
        res.status(500).json(error)
    }
})

server.get('/api/cohorts/:id', async (req, res) => {
    try {
        const cohort = await db('cohorts')
            .where({ id: req.params.id })
            .first()
        res.status(200).json(cohort)
    } catch (error) {
        res.status(500).json(error)
    }
})

const errors = {
    '19': 'Another record with that value exists',
  };

server.post('/api/cohorts', async (req, res) => {
    try {
        const [id] = await db('cohorts').insert(req.body)

        const cohort = await db('cohorts')
            .where({ id })
            .first()

        res.status(201).json(cohort)
    } catch (error) {
        const message = errors[error.errno] || 'We ran into an error'
        res.status(500).json({ message, error })
    }
})

server.put('/api/cohorts/:id', (req, res) => {
    db('cohorts')
      .where({ id: req.params.id })
      .update(req.body)
      .then(count => {
        if (count > 0) {
          res.status(200).json({
            message: `${count} ${count > 1 ? 'records' : 'record'} updated`,
          });
        } else {
          res.status(404).json({ message: 'Cohort does not exist' });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  server.delete('/api/cohorts/:id', (req, res) => {
    db('cohorts')
      .where({ id: req.params.id })
      .del()
      .then(count => {
        if (count > 0) {
          res.status(200).json({
            message: `${count} ${count > 1 ? 'records' : 'record'} deleted`,
          });
        } else {
          res.status(404).json({ message: 'Role does not exist' });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

server.listen(5000, () => 
    console.log(`\n** API running on 5000 **\n`)
)