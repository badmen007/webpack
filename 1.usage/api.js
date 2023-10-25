
const express = require( 'express')
const app = express()

app.get('/users', (req, res) => {
  res.json([
    {id: 1, name: 'xzx'}
  ])
})

app.listen(4000, () => {
  console.log('server running')
})