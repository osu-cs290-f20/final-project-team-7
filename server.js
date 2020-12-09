const express = require('express')
const exphbs = require('express-handlebars');
const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.status(200).render('game');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
