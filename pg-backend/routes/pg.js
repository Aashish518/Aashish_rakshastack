const express = require('express');
const router = express.Router();

// Middleware to verify token
const authMiddleware = require('../middleware/authmid');

// Multer + Cloudinary setup to handle image uploads
const upload = require('../utils/cloudinary');

// Pg controllers
const {addPG,getPGDetails,getPGs,updatePG,deletePG, getAllPGs, getUserPGs} = require('../controllers/pg');



// Route to add a new PG listing
router.post('/add-pg', upload.array('images'), authMiddleware, addPG);

// Route to get all PG listings 
router.get('/pg-listings', getPGs);

// Route to get details of a specific PG by ID
router.get('/pg-details/:id', authMiddleware, getPGDetails);

// Route to delete a PG listing by ID
router.delete('/delete-pg/:id', authMiddleware, deletePG);

// Route to update a PG listing by ID
router.put('/update-pg/:id', upload.array('images'), authMiddleware, updatePG);

// Route to get all PG listings with user data
router.get('/my-pgs', authMiddleware, getUserPGs);




// Export the router to use in main app
module.exports = router;
