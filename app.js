require('dotenv').config();
////
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

require('./config/db.config')

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Cookies/Sessions

//allows use to use express session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'bybys',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 24*60*60*1000//in miliseconds
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24*60*60//in seconds = 1day //timetolive
  })
}));

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/', profileRoutes);

const bandRoutes = require('./routes/bandRoutes');
app.use('/', bandRoutes);

const listingRoutes = require('./routes/listingRoutes');
app.use('/', listingRoutes);

module.exports = app;
