const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const _ = require('lodash')
const mongoose = require('mongoose')
let posts = []
const homeStartingContent =
  'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.'
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.'
const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.'

const app = express()
// setting ejs
app.set('view engine', 'ejs')
// setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// setting static files
app.use(express.static('public'))
// setting mongoose
mongoose.connect('mongodb://0.0.0.0:27017/Daily-Journal')
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
})
const post = mongoose.model('Post', postSchema)

app.get('/', async (req, res) => {
  posts = await post.find({})
  const titles = posts.map((post) => {
    const title = post.title
    return title
  })
  if (!titles.includes('Home')) {
    await post.create({ title: 'Home', content: homeStartingContent })
  }
  // const title = data.title
  // const content = data.content
  res.render('home', {
    newPost: posts
  })
})

// posts se ek object uthana hai, for loop
// usmein se title aur post alag alag lene hai
// unhe home page pr print krna hai
app.get('/about', (req, res) => {
  res.render('about', { StartingContent: aboutContent })
})
app.get('/contact', (req, res) => {
  res.render('contact', { StartingContent: contactContent })
})
// route parameters
app.get('/posts/:topic', (req, res) => {
  const topic = _.lowerCase(req.params.topic)
  posts.forEach((e) => {
    const title = e.title
    const para = e.content
    if (topic === _.lowerCase(title)) {
      console.log('Match Found!')
      res.render('post', { postTitle: title, postPara: para })
    }
  })
})
// challenge
// agar ham posts/topic daale url mein toh topic vala page khul jaye
// page bnana hai
// challenge
// if topic is equal to kisis bhi blog post ke title ke toh match found
// compose page
app.get('/compose', (req, res) => {
  res.render('compose')
})
app.post('/compose', async (req, res) => {
  await post.create({ title: req.body.title, content: req.body.post })
  res.redirect('/')
})
app.listen(3000, function () {
  console.log('Server started on port 3000')
})
