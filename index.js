const fastify = require('fastify')({
    logger: true,
    ignoreTrailingSlash:true
}) 
const db = require('./queries')
 

fastify.get('/',(req,res) => {
   res.send('hello world')
})

fastify.get('/users',db.getUsers); 
fastify.post('/users',db.createUser);

fastify.listen(3000)