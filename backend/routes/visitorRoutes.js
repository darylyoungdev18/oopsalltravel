import express from 'express';
import { getAllBlogsForVisitors } from '../controllers/visitorController.js';

const router = express.Router();

router.get('/blogs', getAllBlogsForVisitors);

export default router;