/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { bcrypt, jwt, HTTP_STATUS } = require('../../config/constant');
module.exports = {

  // register action is used to register a new user
  register: async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
      if (!fullName || !email || fullName.length < 3) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          message: req.i18n.__('NAME_EMAIL')
        });
      }
      try {
        const userAvailable = await User.findOne({ email });
        if (userAvailable) {
          return res.status(HTTP_STATUS.ALREADY_EXISTS).send({
            message: req.i18n.__('USER_AVAILABLE')
          });
        }
      } catch (error) {
        console.error('Error checking user availability:', error);
        return res.status(HTTP_STATUS.SERVER_ERROR).send({
          message: req.i18n.__('SERVER_ERROR'),
          error: error.message
        });
      }

      if (!password || password.length < 6) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          message: req.i18n.__('PASSWORD_NECESSARY')
        });
      }
      // hashing the password with bcrypt by having 10 salt
      const newPassword = await bcrypt.hash(password, 10);
      const registerUser = await User.create({ fullName, email, password: newPassword }).fetch();
      return res.status(HTTP_STATUS.CREATED).json({
        message: req.i18n.__('USER_REGISTERED'),
        registerUser
      });
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        message: req.i18n.__('SERVER_ERROR'),
        error: error.message
      });
    }
  },

  // login action is used to login the user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          message: req.i18n.__('EMAIL_PASSWORD')
        });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          message: req.i18n.__('USER_NOT_FOUND')
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          message: req.i18n.__('PASSWORD_NO_MATCH')
        });
      }
      const tokenObject = {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      };

      // generating the token by passing the token object and secret key which will expire after 4hours
      const jwtToken = jwt.sign(tokenObject, process.env.SECRET, { expiresIn: '4h' });
      return res.status(HTTP_STATUS.SUCCESS).json({
        message: req.i18n.__('USER_LOGIN'),
        jwtToken,
        tokenObject
      });
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        message: req.i18n.__('SERVER_ERROR'),
        error: error.message
      });
    }
  }
};

