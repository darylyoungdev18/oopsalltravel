import { Blog_View } from '../models/Blog_View.js';

// track blog views
export const trackBlogView = async (req, res) => {
  const { visitorId, userId, blogId } = req.body;
  try {
    const newView = await Blog_View.create({ Visitor_ID: visitorId, User_Account_ID: userId, Blog_ID: blogId });
    res.status(201).json(newView);
  } catch (error) {
    console.error('Error tracking blog view:', error);
    res.status(500).json({ message: 'Database error' });
  }
};