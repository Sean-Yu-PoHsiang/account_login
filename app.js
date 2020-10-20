//set required node modules
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const crypto = require('crypto');

const app = express()
const PORT = 3000

//set view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//set body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//set cookie parser
app.use(cookieParser())

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

//generate session_ID with SHA-256 algorithm
function hashGenerator(string) {
  const hash = crypto.createHash('sha256');
  hash.update(string)
  return hash.digest('hex')
}

//function to disturb password
function randomStringLetter(string) {
  let arr = string.split('')
  for (let index = arr.length - 1; index > 0; index--) {
    let randomIndex = Math.floor(Math.random() * (index + 1))
      ;[arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]]
  }
  let newString = ''
  arr.forEach(element => newString += element)
  return newString
}

// route of index page
app.get('/', (req, res) => {
  if (req.cookies.session_ID !== undefined) {
    const session_ID = req.cookies.session_ID

    for (let i = 0; i < users.length; i++) {
      if (users[i].session_ID === session_ID) {
        return res.render('index', { isLogin: true, userFirstName: users[i].firstName })
      }
    }
  }
  return res.redirect('/login')
})

//route of login page
app.get('/login', (req, res) => {
  res.render('login')
})

//rout of log out
app.get('/logout', (req, res) => {
  res.clearCookie('session_ID')
  return res.redirect('/')
})

//route of login response
app.post('/login', (req, res) => {
  const account = req.body

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === account.email && users[i].password === account.password) {
      const content = users[i].email + randomStringLetter(users[i].password + users[i].password)
      const hashCode = hashGenerator(content)
      users[i].session_ID = hashCode

      res.cookie("session_ID", hashCode, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24), httpOnly: true });

      return res.redirect('/')
    }
  }
  return res.render('login', { accountWrong: true })
})


//set server listen to port localhost:3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})