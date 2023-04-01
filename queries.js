const {Client} = require('pg');
const bcrypt = require('bcryptjs')

const client = new Client({
    user:"postgres",
    host:"127.0.0.1",
    database:"postgres", 
    password:"Zaeem1198!",
    port:5432
});

client.connect();
 
const getUsers = async (request, response) => {
    try {
      const { rows } = await client.query('SELECT * FROM users2 ORDER by id ASC');
      response.status(200).send(rows);
    } catch (error) {
      console.error(error);
      response.status(500).send('Internal Server Error');
    }
  };

  const createUser = async (request, response) => {
    try {
      const { first_name, last_name, email, password } = request.body;

           function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      }

      if(!first_name) {
        return response.status(400).send('First name cannot be null')
      }
      if(!last_name) {
        return response.status(400).send('Last name cannot be null')
      }
      if(!email) {
        return response.status(400).send('Email cannot be null')
      }
      if(!password) {
        return response.status(400).send('password cannot be null')
      }

      if (isValidEmail(email)) {
        console.log('email is valid')
      } else {
        return response.status(400).send(`${email} is not a valid email address`);
      }

      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) reject(err);
          resolve(hash);
        });
      });
  
      const result = await client.query(
        `INSERT INTO users2 (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [first_name, last_name, email, hashedPassword]
      );
  
      response.status(200).send(`User added with id: ${result.rows[0].id}`);
    } catch (error) {
      console.error(error);
      response.status(500).send('Internal Server Error');
    }
  };
  

module.exports= {
    getUsers,
    createUser,
};