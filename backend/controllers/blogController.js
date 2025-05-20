import { Blog } from '../models/Blog.js';
import { User_Account } from '../models/User_Account.js'; // Import the User_Account model


// Function to create a new blog post
export const createBlog = async (req, res) => {
  const { title, content, userId } = req.body;
  try {
    const newBlog = await Blog.create({ title, content, User_Account_ID: userId });
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Function to get all blog posts
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: {
        model: User_Account,
        attributes: ['User_Account_Name']
      }
    });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Database error' });
  }
};


// Function to get a single blog post by ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByPk(id, {
      include: {
        model: User_Account,
        attributes: ['User_Account_Name']
      }
    });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Function to update a blog post by ID
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const blog = await Blog.findByPk(id, {
      include: {
        model: User_Account,
        attributes: ['User_Account_Name']
      }
    });
    if (blog) {
      blog.title = title;
      blog.content = content;
      await blog.save();
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Function to delete a blog post by ID
export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByPk(id, {
      include: {
        model: User_Account,
        attributes: ['User_Account_Name']
      }
    });
    if (blog) {
      await blog.destroy();
      res.status(200).json({ message: 'Blog deleted' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Database error' });
  }
};