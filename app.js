import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import fetch from 'node-fetch';
import cors from 'cors';
import { sequelize } from './backend/config/database.js';
import authRoutes from './backend/routes/authRoutes.js';
import blogRoutes from './backend/routes/blogRoutes.js';
import userRoutes from './backend/routes/userRoutes.js';
import visitorRoutes from './backend/routes/visitorRoutes.js';
import blogLikeRoutes from './backend/routes/blogLikeRoutes.js';
import blogViewRoutes from './backend/routes/blogViewRoutes.js';
import placeRoutes from './backend/routes/placeRoutes.js';
import welcomeRoutes from './backend/routes/welcomeRoute.js';
import aboutRoutes from './backend/routes/aboutRoutes.js'; // Adjust the path as necessary
import { trackVisitor } from './backend/middleware/visitorTracker.js';
import path from 'path';
import {fileURLToPath} from 'url';
import './backend/models/Visitor.js';
import './backend/models/User_Account.js';
// Initialize model associations
import initializeAssociations from './backend/models/associations.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware for parsing request bodies
app.set('trust proxy', true);
// Session middleware setup
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
  }));  
app.use((req, res, next) => {
res.locals.userLoggedIn = !!req.session.userId;
next();
});

app.use(cors());
  
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// this really needs to be placed before any routes and the trackvistor middleware
app.use(cookieParser());
    
//needs to be placed after cookieparser
app.use(trackVisitor);



initializeAssociations();

sequelize.sync().then(() => {
    app.listen(3000, () => console.log('REST API running on port 3000'));
  })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

    app.get('/', (req, res) => {
        const username = req.session.username || 'Guest';
        res.render('index', { username });
      });

      app.get('/main', (req, res) => {
        res.render('main');
      });
      app.get('/sign-up', (req, res) => {
        res.render('sign-up');
      });
      app.get('/login', (req, res) => {
        res.render('login', { errorMessage: null });
      });
      
      
      

// API Routes

const apiKey =  process.env.API_KEY; 
  
// Route to handle place autocomplete
app.get('/api/places', async (req, res) => {
    const { input } = req.query;
   
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=${apiKey}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Route to handle place details
  app.get('/api/place-details', async (req, res) => {
    const { placeId, fields } = req.query;

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching place details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Route to handle fetching place photos
app.get('/api/place-photo', async (req, res) => {
    const { photoReference } = req.query;

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`);
        const buffer = await response.buffer();
        res.set('Content-Type', 'image/jpeg');
        res.send(buffer);
    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/blog-likes', blogLikeRoutes);
app.use('/blog-views', blogViewRoutes);
app.use('/', placeRoutes);
app.use('/visitors', visitorRoutes);
app.use('/users', userRoutes);
app.use('/welcome', welcomeRoutes);
app.use('/about', aboutRoutes);

// Sync Database and Start Server
;
