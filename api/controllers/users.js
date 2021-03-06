const User = require('../models/users');
const Note = require('../models/notes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validators = require('../validators');

const controller = {
  async getData(req, res, next) {
    let noteId = req.body.noteId;
    let user;

    if (typeof noteId !== 'string') {
      return next({ status: 401 });
    }

    try {
      user = await User.findOne({ noteId });
    } catch (e) {
      return next({ status: 404 });
    }
    res.send({ status: 'success', user: user.email });
  },

  async create(req, res, next) {
    let { email, password } = req.body;
    let user, note;

    if (!email || !password || !validators.password(password)) {
      let err = new Error('Incomplete request');

      err.status = 400;
      return next(err);
    }
    try {
      user = await User.create({ email, password });
      note = await Note.create({});

      user.noteId = note._id;
      await user.save();
    } catch (e) {
      let err = new Error('Failed to create user.');

      err.status = 400;
      return next(err);
    }

    res.send({ status: 'success' });
  },

  async authenticate(req, res, next) {
    let { email, password } = req.body;
    let user, token;
    console.error('SIGNIN CALLED')
    const secret = req.app.get('secretKey');

    if (!email || !password) {
      let err = new Error('Incomplete request');
      err.status = 400;
      return next(err);
    }

    try {
      user = await User.findOne({ email });
      let isMatch = await user.comparePassword(password);

      if (!user || !isMatch) throw new Error('Invalid password.');

      token = jwt.sign({ id: user.noteId }, secret, {
        expiresIn: '2h'
      });
      res.send({
        status: 'success',
        message: 'User authenticated successfully.',
        token
      });
    } catch (e) {
      let err = new Error('Failed to authenticate user.');

      console.error('ERR')
      console.error(e)

      err.status = 401;
      return next(err);
    }
  }
};

module.exports = controller;
