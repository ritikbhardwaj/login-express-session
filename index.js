require('dotenv').config();
const express = require('express');
const session = require('express-session');
//const colors = require('colors');  not necessary
const morgan = require('morgan');
const db = require('./database');
const bcrypt = require('bcrypt');
const app = express();

//ENV variables
const { PORT, SESS_LIFETIME, SESS_SECRET } = process.env;

//MIDDLEWARES

app.set('view engine', 'ejs');
app.use(express.static('public'));

//express session configuration
app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: SESS_SECRET,
		cookie: {
			maxAge: 600000, //maximum age of the cookie
			sameSite: true
		}
	})
);
app.use(morgan('dev')); //logging
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const redirectLogin = (req, res, next) => {
	if (!req.session.email) {
		res.redirect('/login');
	} else {
		next();
	}
};

const redirectDashboard = (req, res, next) => {
	if (req.session.email) {
		res.redirect('/dashboard');
	} else {
		next();
	}
};

//ROUTES

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/login', redirectDashboard, function(req, res) {
	res.render('login');
});

app.post('/login', redirectDashboard, function(req, res) {
	const { email, password } = req.body;
	db.query('SELECT email,password FROM users WHERE email=? ', [email], function(
		err,
		users
	) {
		if (err) {
			res.send(err).status(500);
		} else {
			if (users.length) {
				bcrypt
					.compare(password, users[0].password)
					.then(function(result) {
						if (result) {
							req.session.email = email;
							res.json({ email, authenticated: true }).status(200);
						} else {
							res
								.json({
									authenticated: false,
									message: 'Username or Password may be incorrect'
								})
								.status(401);
						}
					})
					.catch(err => {
						throw err;
					});
			} else {
				res
					.json({
						authenticated: false,
						message: 'Invalid email'
					})
					.status(404);
			}
		}
	});
});

app.get('/logout', redirectLogin, function(req, res) {
	req.session.destroy(function(err) {
		if (err) throw err;
		res.render('login');
	});
});

app.get('/dashboard', redirectLogin, function(req, res) {
	res.render('dashboard', { email: req.session.email });
});

//SERVER
app.listen(PORT,function(){
	console.log(`Listening on PORT - ${PORT}`);
});
