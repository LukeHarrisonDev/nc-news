# Northcoders News API

# Hosted API Link

https://nc-news-4-life.onrender.com/api
the "/api" will show you a list of endpoints and queries that you can use.

# The Project

This project is an API for News Articles including users, comments, topics and of course, articles. It was developed using TDD and makes use of Express and the HTTP protocol. It makes use of GET, POST, PATCH and DELETE HTTP methods for relevant endpoints. Follow the link above to get started with your options.

# Setup

> Creating environment files

Use the following instructions to add the .env files which will allow you to create and access the databases.

1. Create ".env.test" file to connect to the test database.
2. Type in PGDATABASE=nc_news_test
3. Create ".env.development" file to connect to the development database.
4. Type in PGDATABASE=nc_news

> Clone the Repo

Copy the following link, (Or copy the link from the GitHub Repo page) and use "git clone [link]" in the the terminal

https://github.com/LukeHarrisonDev/nc-news.git

> Install the dependancies with "npm install"

Run 'npm install' to install the dependancies

> Seed Databases

1. Run the script "npm run setup-dbs" to create the databases
2. Run the script "npm run seed" to seed the development database
3. Run the app.test.js file using jest to seed the test database and simultaneously run the tests.

> Running Tests

Tests include:

1. app.test.js - Main test file that runs end 2 end tests
2. model-utils.test.js - Tests any extra functions that are used by the model
3. utils.test.js - Tests are for functions used during seeding

# Minimum Versions

node.js v21.7.3
PostgreSQL 14.12

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
