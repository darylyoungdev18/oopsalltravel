import { Blog } from '../models/Blog.js';

// Function to get all blog posts for visitors
export const getAllBlogsForVisitors = async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Database error' });
  }
};