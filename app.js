/*
*'require' works the same as import in java and python
*/

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');
const passport = require('passport');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Library to use MySQL to store session objects
const MySQLStore = require('express-mysql-session');
const db = require('./config/db');

// Load routes
const mainRoute = require('./routes/main');
const userRoute = require('./routes/user');
const recordsRoute = require('./routes/records');


// Bring in database connection
const selfcarerecordsDB = require('./config/DBConnection');

// Connects to MySQL database
selfcarerecordsDB.setUpDB(false);

// Passport Config
const authenticate = require('./config/passport');
authenticate.localStrategy(passport);

/*
* Creates an Express server - Express is a web application framework for creating web applications
* in Node JS.
*/
const app = express();

// Handlebars Middleware
/*
* 1. Handlebars is a front-end web templating engine that helps to create dynamic web pages using variables
* from Node JS.
*
* 2. Node JS will look at Handlebars files under the views directory
*
* 3. 'defaultLayout' specifies the main.handlebars file under views/layouts as the main template
*
* */
app.engine('handlebars', exphbs({
	defaultLayout: 'main' // Specify default template views/layout/main.handlebar 
}));
app.set('view engine', 'handlebars');


// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// Express session middleware - uses MySQL to store session
app.use(session({
	key: 'selfcarerecords_session',
	secret: 'tojiv',
	store: new MySQLStore({
		host: db.host,
		port: 3306,
		user: db.username,
		password: db.password,
		database: db.database,
		clearExpired: true,

		checkExpirationInterval: 900000,
		expiration: 900000
	}),

	resave: false,
	saveUninitialized: false
}));

app.use(session({
	key: 'selfcarerecords_session',
	secret: 'tojiv',
	resave: false,
	saveUninitialized: false,
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(FlashMessenger.middleware);

app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

app.use(function(req, res, next) {
	next();
});

// Use Routes
/*
* Defines that any root URL with '/' that Node JS receives request from, for eg. http://localhost:5000/, will be handled by
* mainRoute which was defined earlier to point to routes/main.js
*/

app.use('/', mainRoute);
app.use('/user', userRoute);
app.use('/records', recordsRoute);

/*
* Creates a unknown port 5000 for express server since we don't want our app to clash with well known
* ports such as 80 or 8080.
*/

const port = 5000;
const weblink = 'http://localhost:5000'

// Starts the server and listen to port 5000
app.listen(port, () => {
	console.log(`Server started on port ${port}, use this link ${weblink}`);
});