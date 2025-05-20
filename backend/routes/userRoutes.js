import express from 'express';
import bcrypt from 'bcrypt';
import { User_Account } from '../models/User_Account.js';
import { getUserDetails } from '../controllers/userController.js';
import {Visitor} from '../models/Visitor.js';

const router = express.Router();


router.post('/register', async (req, res) => {
const { username, email, password, phone } = req.body;
try {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

    // Retrieve visitorUuid from cookies
  const visitorUuid = req.cookies.visitorUuid;
    if (!visitorUuid) {
      return res.status(400).json({ message: 'Visitor UUID not found in cookies.' });
    }
  
    // Find the Visitor_ID using the visitorUuid
    const visitor = await Visitor.findOne({ where: { Visitor_UUID: visitorUuid } });
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found.' });
    } 
  // Create a new user
  const newUser = await User_Account.create({ User_Account_Name: username, User_Account_Password: hashedPassword, User_Account_Email: email, User_Account_Phone: phone, Visitor_ID: visitor.Visitor_ID });
  
  res.redirect('/welcome');
} catch (error) {
  console.error('Error registering user:', error);
  res.render('sign-up', { errorMessage: 'Error registering user. Please try again.' });
}
});

router.get('/login', (req, res) => {
  res.render('login', { errorMessage: null });
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      //may need to bring the if back to User_Account
      const user = await User_Account.findOne({ where: { User_Account_Name: username } });
      if (user && await bcrypt.compare(password, user.User_Account_Password)) {
        req.session.username = user.User_Account_Name;
        req.session.userId = user.User_Account_ID;

        //Redirect to the welcome page
        res.redirect('/welcome');
      } else {
        res.render('login', { errorMessage: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      res.render('login', { errorMessage: 'Invalid username or password' });
    }
  });
  
  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Error logging out. Please try again.');
      }
      res.clearCookie('connect.sid');
      res.redirect('/users/login');
    });
  });

//  get user details along with last 4 blogs and likes
router.get('/userdetails/:userId', getUserDetails);

export default router;