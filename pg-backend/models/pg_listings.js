const mongoose = require('mongoose');
const { Schema } = mongoose;

const pgListingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    latitude: { 
        type: Number,
        required: true
    },
    longitude: { 
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amenities: {
        type: [String],
        default: []
    },
    gender: {
        type: String,
        enum: ['boy', 'girl', 'unisex'],
        required: true
    },
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('PGListing', pgListingSchema);
