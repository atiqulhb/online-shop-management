const http = require('http');
const express = require('express');
const expressSession = require('express-session')
const {keystone, apps} = require('./index.js');
const {initSubscriptionServer} = require("./lib/utils");
const cors = require('cors')


keystone
    .prepare({
        apps: apps,
        dev: process.env.NODE_ENV !== 'production',
    })
    .then(async ({middlewares}) => {

        await keystone.connect();

        const app = express();

        if (process.env.NODE_ENV  === 'production') {
          app.set('trust proxy', 1)
        }

        app.use(cors({
            origin: [process.env.SHOP_ADDRESS, process.env.OWNER_ADDRESS],
            credentials: true
        }))

        app.use(expressSession({
          name: 'osm.sid',
          secret: process.env.COOKIE_SECRET,
          resave: false,
          saveUninitialized: false,
        }))

        app.use(middlewares)

        if (process.env.NODE_ENV === 'development') {
            const expressPlayground = require('graphql-playground-middleware-express').default
            app.get(
                '/',
                expressPlayground({
                    endpoint: '/graphql',
                    subscriptionEndpoint:`ws://localhost:${process.env.PORT}/subscriptions`,
                }),
            )
        }

        const httpServer = http.createServer(app);

        httpServer.listen(process.env.PORT, () => {
            console.log(`listening on http://localhost:${process.env.PORT}`);
            initSubscriptionServer(httpServer,keystone);
        })
    });

