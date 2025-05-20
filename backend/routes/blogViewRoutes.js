import express from 'express';
import { trackBlogView } from '../controllers/blogViewController.js';

const router = express.Router();

// Route to track blog views
router.post('/view', trackBlogView);

export default router;