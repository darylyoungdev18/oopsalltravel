import express from 'express';
import { likeBlog, getLikedBlogs } from '../controllers/blogLikeController.js';

const router = express.Router();


router.post('/like', likeBlog);

// Route to get liked blogs by user
router.get('/liked/:userId', getLikedBlogs);

export default router;