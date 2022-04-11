const path = require('path');
const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'helloworld',
    cookie: {},
    resave: false,
    saveUninitialized: true, 
    store: new SequelizeStore({
        db: sequelize
    })
};

const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Turn on routes
app.use(routes);

// Turn on connection to db and server. 
sequelize.sync({ force: false }).then(() =>{
    app.listen(PORT, () => console.log('Now Listening'));
});