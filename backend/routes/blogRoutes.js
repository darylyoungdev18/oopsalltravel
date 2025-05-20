import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { User_Account } from '../models/User_Account.js';
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { Blog } from '../models/Blog.js';
import { Written_Blog } from '../models/Written_Blog.js';
import { Video_Blog } from '../models/Video_Blog.js';
import { Location } from '../models/Location.js';
import { Blog_Like } from '../models/Blog_Like.js';
import multer from 'multer';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/userAsset/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });



// Route to display all blogs
router.get('/', async (req, res) => {
  const userId = req.session.userId;
  const locationFilter = req.query.location;

  try {
    const locations = await Location.findAll();
    const queryOptions = {
      include: [
        {
          model: User_Account,
          attributes: ['User_Account_Name'],
        },
        {
          model: Location,
        },
      ],
      order: [['Created_At', 'DESC']],
    };

    if (locationFilter) {
      queryOptions.where = { Location_ID: locationFilter };
    }

    const blogs = await Blog.findAll(queryOptions);
    const blogsWithLikes = await Promise.all(blogs.map(async (blog) => {
      // Get like count
      const likeCount = await Blog_Like.count({ where: { Blog_ID: blog.Blog_ID } });

      // Check if the user has liked the blog
      let isLiked = false;
      if (userId) {
        const existingLike = await Blog_Like.findOne({
          where: { Blog_ID: blog.Blog_ID, User_Account_ID: userId },
        });
        isLiked = !!existingLike;
      }

      return {
        ...blog.toJSON(),
        likeCount,
        isLiked,
      };
    }));

    res.render('blogs', { blogs: blogsWithLikes, locations, userLoggedIn: !!userId, query: req.query});
   
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Database error' });
  }
});


router.get('/create', isAuthenticated, (req, res) => {
  res.render('createBlog',{ userLoggedIn: true });
});


router.post('/create', isAuthenticated, (req, res, next) => {
  // Use multer to handle file uploads
  upload.fields([{ name: 'blogImage', maxCount: 1 }, { name: 'videoFile', maxCount: 1 }])
  (req, res, next);}, async(req, res) => {
  if (req.session.userId) {
    const userId = req.session.userId;
    const { title, details, locationPlace, videoFile, blogImage } = req.body;
    const isVideoBlog = req.body.isVideoBlog === 'on'; 
    // Access uploaded files
    const blogImageFile = req.files['blogImage'] ? req.files['blogImage'][0] : null;
    const videoFileFile = req.files['videoFile'] ? req.files['videoFile'][0] : null;

    // Get file paths
    const blogImagePath = blogImageFile ? `/userAsset/${blogImageFile.filename}` : null;
    const videoFilePath = videoFileFile ? `/userAsset/${videoFileFile.filename}` : null;

    console.log('Blog Image Path:', blogImagePath);
    console.log('Video File Path:', videoFilePath);
  
    try {

      let location = await Location.findOne({ where: { Location_Place: locationPlace } });
      if (!location) {
        location = await Location.create({ Location_Place: locationPlace });
      }

      const newBlog = await Blog.create({ 
        Blog_Title:title,  
        Blog_Details:details, 
        Is_Video_Blog:isVideoBlog, 
        User_Account_ID:userId, 
        Blog_IMG_SRC:blogImagePath, 
        Blog_Video_SRC:videoFilePath,
        Location_ID: location.Location_ID,
      });
      
      if (isVideoBlog) {
        await Video_Blog.create({ Blog_ID: newBlog.Blog_ID });
      } else {
        await Written_Blog.create({ Blog_ID: newBlog.Blog_ID });
      }
  
      res.redirect('myblogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ message: 'Database error' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
} ,
 createBlog);


router.get('/myblogs', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const blogs = await Blog.findAll({
      where: { User_Account_ID: userId },
      include:[{model: Location}]
    });
    const blogsWithLikes = await Promise.all(blogs.map(async (blog) => {
      // Get like count
      const likeCount = await Blog_Like.count({ where: { Blog_ID: blog.Blog_ID } });

      // Check if the user has liked the blog
      let isLiked = false;
      if (userId) {
        const existingLike = await Blog_Like.findOne({
          where: { Blog_ID: blog.Blog_ID, User_Account_ID: userId },
        });
        isLiked = !!existingLike;
      }

      return {
        ...blog.toJSON(),
        likeCount,
        isLiked,
      };
    }));

    res.render('myBlogs', { blogs: blogsWithLikes, userLoggedIn: !!userId });

  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ message: 'Database error' });
  }
});




router.get('/:id', isAuthenticated, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;
  try {
    const blog = await Blog.findOne({
      where: { Blog_ID: blogId },
      include: [
        {
          model: User_Account,
          attributes: ['User_Account_Name'],
        },
        {
          model: Location, 
          attributes: ['Location_Place'],
        },
      ],
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    const likeCount = await Blog_Like.count({ where: { Blog_ID: blogId } });

    // Check if the user has liked the blog
    let isLiked = false;
    if (userId) {
      const existingLike = await Blog_Like.findOne({
        where: { Blog_ID: blogId, User_Account_ID: userId },
      });
      isLiked = !!existingLike;
    }

    res.render('single-blog', { blog: blog.toJSON(), likeCount, isLiked, userLoggedIn: !!userId });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Database error' });
  }
});


// Route to display the edit form
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;

  try {
    const blog = await Blog.findOne({
      where: { Blog_ID: blogId, User_Account_ID: userId }
    });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }
    res.render('editBlog', { blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Database error' });
  }
});


// Route to handle the edit submission
router.put('/edit/:id', isAuthenticated, upload.fields([
  { name: 'blogImage', maxCount: 1 },
  { name: 'videoFile', maxCount: 1 }
]), async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;

  try {

    const blog = await Blog.findOne({ where: { Blog_ID: blogId, User_Account_ID: userId } });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }

    // Extract form data
    const { title, details, locationPlace } = req.body;
    const isVideoBlog = req.body.isVideoBlog === 'on';

    // Handle file uploads
    const blogImageFile = req.files['blogImage'] ? req.files['blogImage'][0] : null;
    const videoFileFile = req.files['videoFile'] ? req.files['videoFile'][0] : null;

    // Update file paths if new files are uploaded
    if (blogImageFile) {
      blog.Blog_IMG_SRC = `/userAsset/${blogImageFile.filename}`;
    }
    if (videoFileFile) {
      blog.Blog_Video_SRC = `/userAsset/${videoFileFile.filename}`;
    }


    let location = await Location.findOne({ where: { Location_Place: locationPlace } });
    if (!location) {
      location = await Location.create({ Location_Place: locationPlace });
    }


    // Update other fields
    blog.Blog_Title = title;
    blog.Blog_Details = details;
    blog.Is_Video_Blog = isVideoBlog;
    blog.Location_ID = location.Location_ID;

    await blog.save();

    const existingVideoBlog = await Video_Blog.findOne({ where: { Blog_ID: blogId } });
    const existingWrittenBlog = await Written_Blog.findOne({ where: { Blog_ID: blogId } });

    if (isVideoBlog) {
      // If the blog is now a video blog
      if (existingWrittenBlog) {
        // Delete from Written_Blog if it exists
        await existingWrittenBlog.destroy();
      }
      if (!existingVideoBlog) {
        // Insert into Video_Blog if it doesn't exist
        await Video_Blog.create({ Blog_ID: blogId });
      }
    } else {
      // If the blog is now a written blog
      if (existingVideoBlog) {
        // Delete from Video_Blog if it exists
        await existingVideoBlog.destroy();
      }
      if (!existingWrittenBlog) {
        // Insert into Written_Blog if it doesn't exist
        await Written_Blog.create({ Blog_ID: blogId });
      }
    }


    res.redirect('/blogs/myblogs');
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Database error' });
  }
});


router.delete('/delete/:id', isAuthenticated, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;

  try {
    const blog = await Blog.findOne({ where: { Blog_ID: blogId, User_Account_ID: userId } });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }
    await Blog_Like.destroy({ where: { Blog_ID: blogId } });
    await Written_Blog.destroy({ where: { Blog_ID: blogId } });
    await Video_Blog.destroy({ where: { Blog_ID: blogId } });

    await blog.destroy();
    res.redirect('/blogs/myblogs');
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Database error' });
  }
});


router.post('/like/:id', isAuthenticated, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;

  try {
    // Check if the user has already liked the blog
    const existingLike = await Blog_Like.findOne({
      where: { Blog_ID: blogId, User_Account_ID: userId },
    });

    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this blog.' });
    }

    // Create a new like
    await Blog_Like.create({
      Blog_ID: blogId,
      User_Account_ID: userId,
    });

    // Get updated like count
    const likeCount = await Blog_Like.count({ where: { Blog_ID: blogId } });

    res.json({ message: 'Blog liked successfully.', likeCount });
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to handle unlike action
router.post('/unlike/:id', isAuthenticated, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;

  try {
    // Check if the like exists
    const existingLike = await Blog_Like.findOne({
      where: { Blog_ID: blogId, User_Account_ID: userId },
    });

    if (!existingLike) {
      return res.status(400).json({ message: 'You have not liked this blog yet.' });
    }

    // Remove the like
    await existingLike.destroy();

    // Get updated like count
    const likeCount = await Blog_Like.count({ where: { Blog_ID: blogId } });

    res.json({ message: 'Blog unliked successfully.', likeCount });
  } catch (error) {
    console.error('Error unliking blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
