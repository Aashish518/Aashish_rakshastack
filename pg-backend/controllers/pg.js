const PGListing = require('../models/pg_listings');
const User =require('../models/users');

// Add a new PG listing
exports.addPG = async (req, res) => {
    const { name, location, latitude, longitude, price, amenities, gender } = req.body;

    const images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
    }));

    const amenitiesArray = amenities
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

    try {
        const newPG = new PGListing({
            name,
            location,
            latitude,
            longitude,
            price,
            amenities: amenitiesArray,
            gender,
            images,
            userId: req.user.id
        });

        await newPG.save();
        res.status(201).json({ message: 'PG added successfully', pg: newPG });
    } catch (err) {
        res.status(500).json({ message: 'Error adding PG', error: err.message });
    }
};



// Get PGs
exports.getPGs = async (req, res) => {
    try {
        let {
            search,
            gender,
            minPrice,
            maxPrice,
            amenities,
            page = 1,
            limit = 8
        } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 8;

        const filter = {};

        if (search && search.trim() !== "") {
            filter.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                { location: { $regex: search.trim(), $options: "i" } }
            ];
        }

        if (gender && gender.trim() !== "") {
            filter.gender = gender.trim().toLowerCase();
        }

        if (minPrice && maxPrice) {
            filter.price = {
                $gte: parseInt(minPrice),
                $lte: parseInt(maxPrice)
            };
        } else if (minPrice) {
            filter.price = { $gte: parseInt(minPrice) };
        } else if (maxPrice) {
            filter.price = { $lte: parseInt(maxPrice) };
        }

        // Filter by amenities (any one match)
        if (amenities && amenities.trim() !== "") {
    const amenitiesArray = amenities.split(",").map(a => a.trim());

    // Require ALL amenities to be present in DB's amenities array
    filter.amenities = { $all: amenitiesArray };
        } if (amenities && amenities.trim() !== "") {
            const amenitiesArray = amenities.split(",").map(a => a.trim());

            // Require ALL amenities to be present in DB's amenities array
            filter.amenities = { $all: amenitiesArray };
        }

        const total = await PGListing.countDocuments(filter);

        const pgs = await PGListing.find(filter)
            .select("name price location amenities gender images")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            pgs
        });

    } catch (err) {
        console.error("Error fetching PGs:", err);
        res.status(500).json({
            message: "Error fetching PGs",
            error: err.message
        });
    }
};




// Get details of a single PG by ID
exports.getPGDetails = async (req, res) => {
    const { id } = req.params;

    try {
        // Find PG by ID
        const pg = await PGListing.findById(id).populate('userId', 'name email');
        
        // If PG not found
        if (!pg) return res.status(404).json({ message: 'PG not found' });

        // Send PG details
        res.status(200).json({ pg });

    } catch (err) {
        res.status(500).json({ message: 'Error fetching PG detail', error: err.message });
    }
};



// Delete a PG listing and its Cloudinary images
exports.deletePG = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the PG by ID
        const pg = await PGListing.findById(id);
        if (!pg) return res.status(404).json({ message: 'PG not found' });


        for (let img of pg.images) {
            try {
                const result = await cloudinary.uploader.destroy(img.public_id);
            } catch (err) {
                console.error("Error deleting", img.public_id, err);
            }
        }


        // Delete PG from database
        await PGListing.findByIdAndDelete(id);

        res.status(200).json({ message: 'PG and images deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Error deleting PG', error: err.message });
    }
};




// Update PG listing and replace images
exports.updatePG = async (req, res) => {
    const { id } = req.params;
    const { name, location, latitude, longitude, price, amenities, gender } = req.body;

    try {
        const pg = await PGListing.findById(id);
        if (!pg) {
            return res.status(404).json({ message: 'PG not found' });
        }

        // Update basic fields
        if (name) pg.name = name;
        if (location) pg.location = location;
        if (latitude) pg.latitude = latitude;
        if (longitude) pg.longitude = longitude;
        if (price) pg.price = price;
        if (amenities) pg.amenities = amenities;
        if (gender) pg.gender = gender;

        // If new images uploaded → delete old ones and set new
        if (req.files && req.files.length > 0) {
            // Delete old images from Cloudinary
            for (let img of pg.images) {
                try {
                    await cloudinary.uploader.destroy(img.public_id);
                } catch (err) {
                    console.error(`Failed to delete image ${img.public_id} from Cloudinary:`, err);
                }
            }

            // Add new images
            const newImages = req.files.map(file => ({
                url: file.path,
                public_id: file.filename
            }));
            pg.images = newImages;
        }

        await pg.save();

        res.status(200).json({
            message: 'PG updated successfully',
            pg
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating PG',
            error: err.message
        });
    }
};



// Controller to get all PG listings with user data
exports.getUserPGs = async (req, res) => {
    try {
        const userId = req.user.id;

        const pgs = await PGListing.find({ userId })

        res.status(200).json({
            success: true,
            count: pgs.length,
            data: pgs
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching PG listings for user',
            error: err.message
        });
    }
};