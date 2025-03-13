const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: process.env.CONNECTION_URI,
    collection: 'sessions',
    ssl: true,
    sslValidate: true,
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
});

store.on('error', function(error) {
    console.error('Session store error:', error);
});

const sessionMiddleware = session({
    store: store,
    credentials: true,
    cookie: {
        httpOnly: false,
        secure: false,
    },
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    maxAge: 20000,
});

const wrap = expressMiddleware => (socket, next) => expressMiddleware(socket.request, {}, next);

module.exports = { sessionMiddleware, wrap };
