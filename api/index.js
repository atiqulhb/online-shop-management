require('dotenv').config()
const path = require('path')
const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp, validation } = require('@keystonejs/app-graphql')
const { StaticApp } = require('@keystonejs/app-static')
const { MongooseAdapter} = require('@keystonejs/adapter-mongoose')
const { PasswordAuthStrategy } = require('@keystonejs/auth-password')
const { GoogleAuthStrategy, FacebookAuthStrategy } = require('@keystonejs/auth-passport')
const expressSession = require('express-session')
const redis = require('redis')

let RedisStore = require('connect-redis')(expressSession)
let redisClient = redis.createClient()

const { Product, User, ForgottenPasswordToken, CartItem, Cart, Order, Stock, Message, Role, Courier, Position, Delivery, Location, HistoryOfAddingToCart, customSchema } = require('./schema')

const keystone = new Keystone({
  adapter: new MongooseAdapter({ mongoUri: process.env.DATABASE_URL }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Default to true in production
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: false,
  },
  cookieSecret: process.env.COOKIE_SECRET,
  sessionStore: new RedisStore({ client: redisClient }),
})

keystone.createList('Product', Product);
keystone.createList('User', User);
keystone.createList('ForgottenPasswordToken', ForgottenPasswordToken);
keystone.createList('CartItem', CartItem);
keystone.createList('Cart', Cart);
keystone.createList('Order', Order);
keystone.createList('Stock', Stock);
keystone.createList('Message', Message);
keystone.createList('Role', Role);
keystone.createList('Courier', Courier);
keystone.createList('Position', Position);
keystone.createList('Delivery', Delivery);
keystone.createList('Location', Location);
keystone.createList('HistoryOfAddingToCart', HistoryOfAddingToCart);

keystone.extendGraphQLSchema(customSchema);


keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
})

const googleStrategy = keystone.createAuthStrategy({
  type: GoogleAuthStrategy,
  list: 'User',
  config: {
    idField: 'googleId',
    appId: process.env.GMAIL_CLIENT_ID,
    appSecret: process.env.GMAIL_CLIENT_SECRET,
    loginPath: '/auth/google',
    callbackPath: '/auth/google/callback',
    callbackHost: 'http://localhost:8800',

    // Once a user is found/created and successfully matched to the
    // googleId, they are authenticated, and the token is returned here.
    // NOTE: By default Keystone sets a `keystone.sid` which authenticates the
    // user for the API domain. If you want to authenticate via another domain,
    // you must pass the `token` as a Bearer Token to GraphQL requests.
    onAuthenticated: ({ token, item, isNewItem }, req, res) => {
      console.log(token);
      res.redirect('/');
    },

    // If there was an error during any of the authentication flow, this
    // callback is executed
    onError: (error, req, res) => {
      console.error(error);
      res.redirect('/?error=Uh-oh');
    },
  },
})

keystone.createAuthStrategy({
    type: FacebookAuthStrategy,
    list: 'User',
    config: {
      idField: 'facebookId',
      appId: 'sdfdsfssdfs',
      appSecret: 'dfsdfsdf',
      loginPath: '/auth/facebook',
      callbackPath: '/auth/facebook/callback'
    }
})


const apps = [
	new GraphQLApp({
		apiPath: '/graphql',
		graphiqlPath: '/graphiql',
	}),
	new StaticApp({
    src: path.join(__dirname, '/files'),
    path: '/files',
  })
]

module.exports = { keystone, apps }