const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');

const cors = require('cors');
const db = require('./models');
const PORT = process.env.PORT || 4000;

require('dotenv').config({
    path: './config/config.env'
});

/// Connect to database by using sequelize
async function assertDatabaseConnectionOk () {
    console.log('Checking database connection...');
    try {
        await db.sequelize.sync();
        console.log('Database connection OK!');
    } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error.message);
        process.exit(1);
    }
}

app.set('trust proxy', 1);

app.use(bodyParser.json());
app.use(methodOverride('_method'));

// USE SESSION TO LOGIN/LOGOUT
if (process.env.NODE_ENV !== 'production') {
    app.use(session({ 
        secret: 'randomsecret',
        resave: true,
        saveUninitialized: true,
    }));
} else{
    app.use(session({ 
        secret: 'randomsecret',
        resave: true,
        saveUninitialized: true,
        cookie:{
            sameSite:'none',
            secure: true
        }
    }));
}
app.use(cors({ origin: process.env.FRONT_END_URL || 'http://localhost:3000', credentials: true }));

app.use(express.urlencoded({ extended: false }));

require('./router')(app);

async function init () {
    await assertDatabaseConnectionOk();

    app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
}

init();

