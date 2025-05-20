import { User_Account  } from '../models/User_Account.js';

export const signupUser = async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await User_Account.create({ username, email, password, phone });
    res.status(201).json({ message: 'User created successfully' });
    // Redirect to the login page
    return res.redirect('/login');
    
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ message: 'Database error' });
  }
};
