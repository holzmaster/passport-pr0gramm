# passport-pr0gramm [![CI](https://github.com/holzmaster/passport-pr0gramm/actions/workflows/CI.yaml/badge.svg)](https://github.com/holzmaster/passport-pr0gramm/actions/workflows/CI.yaml)
[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [pr0gramm](http://pr0gramm.com) using the OAuth 2.0 API.

This module lets you authenticate using pr0gramm in your Node.js applications.
By plugging into Passport, pr0gramm authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install
```
npm i passport-pr0gramm
```

## Usage

#### Configure Strategy
The pr0gramm authentication strategy authenticates users using a pr0gramm
account and OAuth 2.0 tokens. The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

```javascript
passport.use(new Pr0grammStrategy({
    clientID: PR0GRAMM_CLIENT_ID,
    clientSecret: PR0GRAMM_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/pr0gramm/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ pr0grammId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests
Use `passport.authenticate()`, specifying the `"pr0gramm"` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com) application:

```javascript
app.get("/auth/pr0gramm", function(req, res, next){
  passport.authenticate("pr0gramm")(req, res, next);
});

app.get("/auth/pr0gramm/callback", function(req, res, next){
  passport.authenticate("pr0gramm", {
    successRedirect: "/",
    failureRedirect: "/login"
  })(req, res, next);
});
```

## Credits
Based on [passport-reddit](https://github.com/Slotos/passport-reddit).

- [Jared Hanson](http://github.com/jaredhanson)
- [Dmytro Soltys](http://github.com/slotos)
- [Brian Partridge](http://github.com/bpartridge83)

## License
[The ISC License](http://opensource.org/licenses/MIT)

Original work Copyright (c) 2012-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
Modified work Copyright (c) 2013 Dmytro Soltys <[http://slotos.net/](http://slotos.net/)>
Modified work Copyright (c) 2013 Brian Partridge <[http://brianpartridge.com/](http://brianpartridge.com/)>
