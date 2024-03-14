const { HTTP_STATUS } = require('../../config/constant');
const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  try {

    // Check if token is passed in the header
    if (!req.headers['authorization']) {
      return res.status(HTTP_STATUS.FORBIDDEN).send({
        message: req.i18n.__('TOKEN_REQUIRED')
      });
    }

    // Verifing the token
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne(decoded.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        message: req.i18n.__('USER_NOT_FOUND')
      });
    }

    // Here we will be checking that action is related to user or reminder
    if (req.params.id) {
      if (user.id !== req.params.id) {
        return res.status(HTTP_STATUS.FORBIDDEN).send({
          message: req.i18n.__('NOT_ALLOWED')
        });
      }
    } else if (req.params.reminderId) {
      const reminder = await Reminder.findOne(req.params.reminderId);
      if (!reminder) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          message: req.i18n.__('NO_REMINDER')
        });

      }
      if (reminder.createdBy !== user.id) {
        return res.status(HTTP_STATUS.FORBIDDEN).send({
          message: req.i18n.__('NOT_ALLOWED')
        });
      }
    } else if (req.body.createdBy) {
      if (user.id !== req.body.createdBy) {
        return res.status(HTTP_STATUS.FORBIDDEN).send({
          message: req.i18n.__('NOT_ALLOWED')
        });
      }
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        message: req.i18n.__('INVALID_REQUEST')
      });
    }
    return next();
  } catch (error) {
    return res.status(HTTP_STATUS.FORBIDDEN).send({
      message: req.i18n.__('INVALID_OR_EXPIRED'),
      error: error.message
    });
  }
};
