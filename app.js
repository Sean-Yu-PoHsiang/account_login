//set required node modules
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

//set view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//set body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//dummy users data
const users = [
  {
    firstName: 'Tony',
    email: 'tony@stark.com',
    password: 'iamironman'
  },
  {
    firstName: 'Steve',
    email: 'captain@hotmail.com',
    password: 'icandothisallday'
  },
  {
    firstName: 'Peter',
    email: 'peter@parker.com',
    password: 'enajyram'
  },
  {
    firstName: 'Natasha',
    email: 'natasha@gamil.com',
    password: '*parol#@$!'
  },
  {
    firstName: 'Nick',
    email: 'nick@shield.com',
    password: 'password'
  }
]


//route of login page
app.get('/', (req, res) => {
  res.render('login')
})

//route of login response
app.post('/', (req, res) => {
  const account = req.body

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === account.email) {
      if (users[i].password === account.password) {
        return res.render('index', { userFirstName: users[i].firstName })
      }
      return res.render('login', { passwordWrong: true, email: account.email })
    }
  }

  return res.render('login', { accountWrong: true })
})


//set server listen to port localhost:3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})