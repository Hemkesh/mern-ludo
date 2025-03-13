module.exports = function (mongoose) {
    mongoose.set('useFindAndModify', false);
    mongoose
        .connect(process.env.CONNECTION_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'test',
            ssl: true,
            sslValidate: true,
        })
        .then(() => {
            console.log('MongoDB Connected…');
        })
        .catch(err => console.error('Error connecting to db:', err));
};
