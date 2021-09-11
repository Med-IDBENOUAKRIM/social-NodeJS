const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config({path: './config/.env'});
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


mongoose.connect(process.env.URI__DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('DB is Connected'))
.catch(() => console.log('DB is NOT Connected'))


app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/post', require('./routes/postRoutes'));
app.use('/api/comment', require('./routes/commentRoutes'));

const port = process.env.PORT || 3500;
app.listen(port, () => console.log(`Your app running on ${port}`))