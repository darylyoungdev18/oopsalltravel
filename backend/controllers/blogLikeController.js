import { Blog_Like } from '../models/Blog_Like.js';

//  like a blog
export const likeBlog = async (req, res) => {
  const { userId, blogId } = req.body;
  try {
    const newLike = await Blog_Like.create({ User_Account_ID: userId, Blog_ID: blogId });
    res.status(201).json(newLike);
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

//  get liked blogs by user
export const getLikedBlogs = async (req, res) => {
  const { userId } = req.params;
  try {
    const likedBlogs = await Blog_Like.findAll({ where: { User_Account_ID: userId } });
    res.status(200).json(likedBlogs);
  } catch (error) {
    console.error('Error fetching liked blogs:', error);
    res.status(500).json({ message: 'Database error' });
  }
};