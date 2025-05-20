import express from 'express';
import { sequelize } from '../config/database.js';
import Blog from '../models/Blog.js';
import Location from '../models/Location.js';

const router = express.Router();

router.get('/places', async (req, res) => {
    try {
      
      const textAfterLastComma = req.query.location || '';
  
      
      const location = await Location.findOne({
        where: sequelize.where(
            sequelize.fn('LOWER', sequelize.col('Location_Place')),
            'LIKE',
            `%${textAfterLastComma.toLowerCase()}%`
          ),});
  
      let hasBlogs = false;
      let locationId = null;
  
      if (location) {
        const blogCount = await Blog.count({
          where: { Location_ID: location.Location_ID },
        });
  
        hasBlogs = blogCount > 0;
        locationId = location.Location_ID;
      }
  
     
      res.render('places', {
        locationName: textAfterLastComma,
        hasBlogs,
        locationId,
      });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).send('Server Error');
    }
  });

  router.get('/api/check-blogs', async (req, res) => {
    try {
      const locationName = req.query.location || '';
  
      const location = await Location.findOne({
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('Location_Place')),
          'LIKE',
          `%${locationName.toLowerCase()}%`
        ),
      });
  
      let hasBlogs = false;
      let locationId = null;
  
      if (location) {
        // Check if any blogs are associated with this location
        const blogCount = await Blog.count({
          where: { Location_ID: location.Location_ID },
        });
  
        hasBlogs = blogCount > 0;
        locationId = location.Location_ID;
      }
  

      res.json({ hasBlogs, locationId });
    } catch (error) {
      console.error('Error checking for blogs:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  export default router;