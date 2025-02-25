/* eslint-disable global-require */
// Module dependencies.
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const mongoConnect = require('./database').mongoConnect;

const routes = {
    categoriesInfo: require('./routes/cateroriesInfo'),
    categoryItems: require('./routes/categoryItems'),
    productDetails: require('./routes/productDetails'),
};

const app = express();

// All environments
app.set('port', 1666);
app.set('views', `${__dirname}/views/Designs`);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.cookieParser('61d333a8-6325-4506-96e7-a180035cc26f'));
app.use(session({
    secret: 'forkpoint training',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    },
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
app.use(express.errorHandler());

// App routes
app.get('/:categoryId', routes.categoriesInfo);
app.get('/products/:categoryId-:subcategoryId', routes.categoryItems);
app.get('/products/:category/:productId', routes.productDetails);
app.get('/products/:category/:productId/:currency', routes.productDetails);


mongoConnect(() => {
    // Run server
    http.createServer(app).listen(app.get('port'), () => {
        // eslint-disable-next-line no-console
        console.log(`Express server listening on port ${app.get('port')}`);
    });
})

