const { PubSub } = require('graphql-subscriptions')
const {execute, subscribe} = require('graphql')
const {SubscriptionServer} = require('subscriptions-transport-ws')

const pubsub = new PubSub()

module.exports.initSubscriptionServer = function (httpServer, keystone,) {
    return new SubscriptionServer({
        execute,
        subscribe,
        schema: keystone._schemas.public,
        onConnect: (connectionPrams, webSocket) => {
            //todo authorization based on AuthList
            const {Authorization} = connectionPrams;
            /*if (Authorization) {

            }*/
            let context = keystone.createContext({
                authentication: {
                    item: {name: 'john', email: 'doe@gmail.com'},
                    listKey: 'User',
                },
            });
            return context;
        }
    },
    {
        server: httpServer,
        path: '/subscriptions'
    })
};