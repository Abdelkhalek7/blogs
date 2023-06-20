const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');





const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {

    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    }).cache({
      key: req.user.id
    });
    
    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {


/* 
    const data=await redisClinet.get(req.user.id );
    console.log("🚀 ~ file: blogRoutes.js:33 ~ app.get ~ data:", data)
if (data) return res.send(JSON.parse( data)); */

    const blogs = await Blog.find({ _user: req.user.id }).cache({
      key: req.user.id
    });

    res.send(blogs)

   // redisClinet.set(req.user.id, JSON.stringify( blogs));

  });

  app.post('/api/blogs',cleanCache,requireLogin,async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
