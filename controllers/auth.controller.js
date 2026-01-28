const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendMail } = require('../services/mail.service');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

exports.register = async(req, res) => {
    const { name, email, role } = req.body;
    const tempPassword = crypto.randomBytes(6).toString('hex');

    const hashed = await bcrypt.hash(tempPassword, 12);

    const user = await User.create({
        name,
        email,
        role,
        password: hashed
    });

    await sendMail(
        email,
        'Account Created',
        `<p>Password: <b>${tempPassword}</b><br/>Please reset after login</p>`
    );

    res.status(201).json({ message: 'User created' });
};

exports.login = async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true
    });

    res.json({ accessToken });
};

exports.forgotPassword = async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ message: 'Mail sent' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const link = `${process.env.CLIENT_URL}/reset/${token}`;

    await sendMail(user.email, 'Reset Password', `<a href="${link}">Reset</a>`);

    res.json({ message: 'Mail sent' });
};

exports.resetPassword = async(req, res) => {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetToken: hashed,
        resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.password = await bcrypt.hash(req.body.password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password updated' });
};