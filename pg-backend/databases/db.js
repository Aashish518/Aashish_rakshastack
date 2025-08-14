const mongoose = require('mongoose');

const MongoDB = () => { 
    mongoose.connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database connection successful.');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
}

module.exports = MongoDB;