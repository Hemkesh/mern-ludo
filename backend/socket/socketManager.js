const { sessionMiddleware } = require('../config/session');

const socketManager = {
    io: null,
    initialize(server) {
        const corsOptions = process.env.NODE_ENV === 'production'
            ? {
                origin: process.env.FRONTEND_URL || 'https://your-render-app.onrender.com',
                credentials: true,
              }
            : {
                origin: true, // Allow all origins in development
                credentials: true,
              };
              
        this.io = require('socket.io')(server, {
            cors: corsOptions,
            allowRequest: (req, callback) => {
                const fakeRes = {
                    getHeader() {
                        return [];
                    },
                    setHeader(key, values) {
                        req.cookieHolder = values[0];
                    },
                    writeHead() {},
                };
                sessionMiddleware(req, fakeRes, () => {
                    if (req.session) {
                        fakeRes.writeHead();
                        req.session.save();
                    }
                    callback(null, true);
                });
            },
        });
    },
    getIO() {
        if (!this.io) {
            throw new Error('Socket.io not initialized');
        }
        return this.io;
    },
};

module.exports = socketManager;
