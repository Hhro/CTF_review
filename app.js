const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const favicon = require('serve-favicon');
require('dotenv').config();

const {sequelize} = require('./models');
const passportConfig = require('./passport');

sequelize.sync();
passportConfig(passport);

const pageRouter = require('./routes/page')
const authRouter = require('./routes/auth');
const challRouter = require('./routes/chall')

const app = express();
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port',process.env.PORT||8002);

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname,'public')));
app.use('/challs',express.static(path.join(__dirname,'challs')))

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth',authRouter);
app.use('/chall',challRouter);

app.use((req,res,next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err,req,res) => {
    res.locals.message =err.message;
    res.loacls.error = req.app.get('env') === 'development' ? err: {};
    res.status(err.stats||500);
    res.render('error')
})

app.listen(app.get('port'), () => {
    console.log('Now Listening on ',app.get('port'));
})