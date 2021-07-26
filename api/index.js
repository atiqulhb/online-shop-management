require('dotenv').config()
const path = require('path')
const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp, validation } = require('@keystonejs/app-graphql')
const { StaticApp } = require('@keystonejs/app-static')
const { MongooseAdapter} = require('@keystonejs/adapter-mongoose')
const { PasswordAuthStrategy } = require('@keystonejs/auth-password')
const expressSession = require('express-session')
const redis = require('redis')

const PROJECT_NAME = 'Ecommerce-Solution'

let RedisStore = require('connect-redis')(expressSession)
let redisClient = redis.createClient()

const { Product, User, ForgottenPasswordToken, CartItem, Cart, Order, Stock, Message, Role, Courier, Position, Delivery, customSchema } = require('./schema')

const keystone = new Keystone({
  adapter: new MongooseAdapter({ mongoUri: process.env.DATABASE_URL }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Default to true in production
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: false,
  },
  cookieSecret: 'cookie',
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

keystone.extendGraphQLSchema(customSchema);


keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
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