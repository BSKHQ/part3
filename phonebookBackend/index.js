const express = require('express')
const app = express()
const morgan = require('morgan')

let phonebook = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]



app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const date = new Date().toUTCString()

    const resp = `Phonebook has info for ${phonebook.length} people</p>`

    response.send(resp.concat(date))
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id == id)
    if (person) {
        response.send(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)
    response.status(204).end()
})

app.use(express.json())
app.use(
    morgan(function (tokens, req, res) {
        return [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, 'content-length'), '-',
          tokens['response-time'](req, res), 'ms',
          JSON.stringify(req.body)
        ].join(' ')
      })
)

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.status(400).json({ error: 'name must not be empty' })
    }

    if (!person.number) {
        return response.status(400).json({ error: 'number must not be empty' })
    }

    if (checkNameExists(person.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    if (checkNumberExists(person.number)) {
        return response.status(400).json({ error: 'number must be unique' })
    }

    let id = getRandomId()
    let p = phonebook.find(p => p.id == id)

    while (p) {
        id = getRandomId()
        p = phonebook.find(p => p.id == id)
    }

    phonebook.push({ ...person, "id": id })

    response.send({ ...person, "id": id })
})

function checkNameExists(name) {
    return phonebook.find(p => p.name == name)
}

function checkNumberExists(number) {
    return phonebook.find(p => p.number == number)
}
function getRandomId() {
    return Math.floor(Math.random() * 50)
}

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)