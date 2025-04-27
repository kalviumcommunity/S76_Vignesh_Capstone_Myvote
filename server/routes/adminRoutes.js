const express = require('express');
const { body, validationResult } = require('express-validator');
const superagent = require('superagent');
const router = express.Router();
const User = require('../model/adminSchema');
const { setOtp, getOtp, deleteOtp } = require('../middleware/otpStore');
const jwt = require('jsonwebtoken');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;


router.post(
  '/signup',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// POST /api/send-otp
router.post(
  '/send-otp',
  [body('email').isEmail().withMessage('Valid email is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const response = await superagent
        .post('https://api.brevo.com/v3/smtp/email')
        .set('accept', 'application/json')
        .set('api-key', BREVO_API_KEY)
        .set('Content-Type', 'application/json')
        .send({
          sender: { name: 'My Vote', email: FROM_EMAIL },
          to: [{ email }],
          subject: 'Your One-Time Password (OTP)',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #2c3e50;">Verification Code</h2>
              <p>Dear User,</p>
              <p>Your One-Time Password (OTP) for verifying your account is:</p>
              <p style="font-size: 18px; font-weight: bold; color: #2c3e50;">${otp}</p>
              <p>This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
              <p>If you did not request this OTP, please ignore this message.</p>
              <br>
              <p>Best regards,<br><strong>My Vote Team</strong></p>
            </div>
          `
        });
        
      console.log('Brevo Response:', response.status, response.body);

      setOtp(email, otp);
      res.json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
      console.error('Send OTP error:', error.message || error);

      if (error.response) {
        console.error('Brevo Response Status:', error.status);
        console.error('Brevo Response Body:', error.response.body);
      } else {
        console.error('No response from Brevo:', error);
      }

      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
  }
);

// POST /api/verify-otp
router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, otp } = req.body;
    const stored = getOtp(email);
    if (!stored) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    }
    if (stored !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    try {
      const user = await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      deleteOtp(email);
      res.json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

router.post('/login', async (req, res) => {
  const { username,email, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: 'User not verified' });
    }
    if (user.password !== password) {   // Replace with proper password hashing in production
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });
    res.json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/forget-password', async(req,res)=>{
  const {email,newPassword} = req.body;
  try {
    const user =await User.findOne({email});
    if(!user){
      res.status(404).json({ success: false, message: 'User not found' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
})

module.exports = router;