import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import expressSession from "express-session";
import methodOverride from "method-override";
import morgan from "morgan";

import passport from "passport";
import { Pr0grammStrategy } from "passport-pr0gramm";

import { URL } from "url";

const PR0GRAMM_CLIENT_ID = process.env.PR0GRAMM_CLIENT_ID;
const PR0GRAMM_CLIENT_SECRET = process.env.PR0GRAMM_CLIENT_SECRET;

const __dirname = new URL(".", import.meta.url).pathname;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete pr0gramm profile is
//   serialized and deserialized.
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

// Use the Pr0grammStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and pr0gramm
//   profile), and invoke a callback with a user object.
//   callbackURL must match redirect uri from your app settings
passport.use(
	new Pr0grammStrategy(
		{
			clientID: PR0GRAMM_CLIENT_ID,
			clientSecret: PR0GRAMM_CLIENT_SECRET,
			callbackURL: "http://localhost:3000/auth/pr0gramm/callback",
		},
		function (_accessToken, _refreshToken, profile, done) {
			// asynchronous verification, for effect...
			process.nextTick(function () {
				// To keep the example simple, the user's pr0gramm profile is returned to
				// represent the logged-in user.  In a typical application, you would want
				// to associate the pr0gramm account with a user record in your database,
				// and return that user instead.
				return done(null, profile);
			});
		},
	),
);

const app = express();

// configure Express
app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");
app.use(morgan("combined"));
app.use(cookieParser());
app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);
app.use(methodOverride());
app.use(
	expressSession({
		secret: "keyboard cat",
		resave: true,
		saveUninitialized: true,
	}),
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(`${__dirname}/public`));

app.get("/", function (req, res) {
	res.render("index", { user: req.user });
});

app.get("/account", ensureAuthenticated, function (req, res) {
	res.render("account", { user: req.user });
});

app.get("/login", function (req, res) {
	res.render("login", { user: req.user });
});

// GET /auth/pr0gramm
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in pr0gramm authentication will involve
//   redirecting the user to pr0gramm.com. After authorization, pr0gramm
//   will redirect the user back to this application at /auth/pr0gramm/callback
app.get("/auth/pr0gramm", function (req, res, next) {
	passport.authenticate("pr0gramm", {
		duration: "permanent",
	})(req, res, next);
});

// GET /auth/pr0gramm/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get("/auth/pr0gramm/callback", function (req, res, next) {
	passport.authenticate("pr0gramm", {
		successRedirect: "/",
		failureRedirect: "/login",
	})(req, res, next);
});

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

app.listen(3000);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected. If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}
