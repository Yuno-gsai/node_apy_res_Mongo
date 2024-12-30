const express = require('express');
const {config} = require('dotenv');
const mongoose = require('mongoose');
const booksRoutes = require('./routes/book.route');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
config();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,{ dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection;
app.use('/books',booksRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})