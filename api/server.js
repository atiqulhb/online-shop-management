const http = require('http');
const express = require('express');
const {keystone, apps} = require('./index.js');
const {initSubscriptionServer} = require("./lib/utils");
const cors = require('cors')

const whitelist = ['http://localhost:5000', 'http://localhost:33785']

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
            origin: true,
            credentials: true
        }))

        // app.use(cors({
        //   origin: ['http://localhost:5000', 'http://localhost:33785'],
        //   credentials: true
        // }))

        // app.use(cors({
        //   origin: function (origin, callback) {
        //     if (whitelist.indexOf(origin) !== -1) {
        //       callback(null, true)
        //     } else {
        //       callback(new Error('Not allowed by CORS'))
        //     }
        //   },
        //   credentials: true
        // }))

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
