import express from 'express';
import { signupUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signupUser);

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ message: 'Logout failed' });
      } else {
        res.redirect('/login');
      }
    });
  });

export default router;

