import express from 'express';
import Blog from '../models/Blog.js';
import Blog_Like from '../models/Blog_Like.js';
import User_Account from '../models/User_Account.js';
import { sequelize } from '../config/database.js'; 
import { QueryTypes } from 'sequelize'

const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    // Redirect to login page if user is not logged in
    return res.redirect('/login');
  }


  try {
       // Call the stored procedure to get the last three blogs added by any user
    const lastThreeBlogs = await sequelize.query('CALL GetLastThreeBlogs()', {
      type: QueryTypes.SELECT,
      raw: true,
    });


    const processedLastThreeBlogs =  lastThreeBlogs.flatMap(item => {
      // If the item is an object with numeric keys (0, 1, 2...)
      if (typeof item === 'object' && item !== null) {
        return Object.keys(item)
          .filter(key => !isNaN(key))
          .map(key => item[key]);
      }
      // If it's already a blog object or another type
      return [item];
    });

    console.log('Last Three Blogs:', lastThreeBlogs)
    console.log('Last Three Blogs:', processedLastThreeBlogs);

    // Call the stored procedure to get the user's last liked blogs
    const lastLikedBlogs = await sequelize.query('CALL GetLastLikedBlog(:uid)', {
      replacements: { uid: userId },
      type: QueryTypes.SELECT,
      raw: true,
    });

    const processedLastLikedBlogs = lastLikedBlogs.flatMap(item => {
      if (typeof item === 'object' && item !== null) {
        return Object.keys(item)
          .filter(key => !isNaN(key))
          .map(key => item[key]);
      }
      return [item];
    });
    console.log('Last Liked Blogs:', lastLikedBlogs);
    console.log('Last Liked Blogs:', processedLastLikedBlogs);

    res.render('welcome', {
      username: req.session.username,
        lastThreeBlogs: processedLastThreeBlogs,
      lastLikedBlogs: processedLastLikedBlogs,
    });
  } catch (error) {
    console.error('Error fetching welcome page data:', error);
    res.status(500).send('Server Error');
  }
});

export default router;