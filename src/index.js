const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const fileUpload = require('express-fileupload')
const SequelizeStore = require('connect-session-sequelize');
const db = require('./models/index.js');
const cron = require('node-cron');

//controller
const {
    getMesinAbsen
} = require('./controllers/inout_cron.controller.js');

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db:db.sequelize
});

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store:store,
    cookie: {
        secure: 'auto',
        expires: 1000 * 60 * 60 * 2
    }
}))

app.use(cors({
    credentials: true,
    origin: [process.env.LINK_FRONTEND]
}));

app.use(express.json());
app.use(fileUpload());

//cron
cron.schedule(process.env.CRON_TIME, function() {
    getMesinAbsen();
});

app.listen(process.env.BACKEND_PORT, ()=>{
    console.log(`server running at port ${process.env.BACKEND_PORT}`);
});
