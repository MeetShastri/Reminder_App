/**
 * ReminderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { HTTP_STATUS } = require('../../config/constant');

module.exports = {

  // addReminder action is used to add new Reminders
  addReminder: async(req,res) => {
    try {
      const {title, description, dueDate, createdBy} = req.body;
      if(!title || !description || !dueDate || !createdBy){
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          message: req.i18n.__('REQUIRED')
        });
      }
      const reminder = await  Reminder.create({title, description, dueDate, createdBy}).fetch();
      return res.status(HTTP_STATUS.CREATED).json({
        message: req.i18n.__('REMINDER_ADDED'),
        reminder
      });
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        message: req.i18n.__('SERVER_ERROR'),
        error: error.message
      });
    }
  },

  // getReminder action is used to get all the Reminders of application
  getReminders: async(req,res) => {
    try {
      const reminders = await Reminder.find();
      return res.status(HTTP_STATUS.SUCCESS).json({
        message: req.i18n.__('ALL_REMINDERS'),
        reminders
      });
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        message: req.i18n.__('SERVER_ERROR'),
        error: error.message
      });
    }
  },

  // getReminder action is used to get Reminders of specific User
  getReminder: async(req,res) => {
    try {
      const createdBy = req.params.id;
      const user = await User.findOne(createdBy);
      if(!user){
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          message: req.i18n.__('USER_NOT_FOUND')
        });
      }
      const data = await Reminder.find({createdBy});
      if(data.length === 0){
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          message: req.i18n.__('NO_DATA')
        });
      }
      return res.status(HTTP_STATUS.SUCCESS).json({
        message: req.i18n.__('ALL_REMINDERS_OF_USER'),
        data
      });
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        message: req.i18n.__('SERVER_ERROR'),
        error: error.message
      });
    }
  },

  // updateReminder action is used to update an existing Reminder
  updateReminder: async(req,res) => {
    try {
      const {reminderId} = req.params;
      const updateData = req.body;
      const reminder = await Reminder.findOne(reminderId);
      if(!reminder){
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          message: req.i18n.__('NO_REMINDER')
        });
      }
      const updatedReminder = await Reminder.updateOne(reminderId).set(updateData);
      return res.status(HTTP_STATUS.SUCCESS).json({
        message: req.i18n.__('REMINDER_UPDATED'),
        updatedReminder
      });
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        message: req.i18n.__('SERVER_ERROR'),
        error: error.message
      });
    }
  },

  // deleteReminder action is used to delete the existing Reminder
  deleteReminder: async(req,res) => {
    try {
      const reminderId = req.params.reminderId;
      const reminder = await Reminder.findOne(reminderId);

      if(!reminder){
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          message: req.i18n.__('NO_REMINDER')
        });
      }
      const deletedReminder = await Reminder.destroy(reminderId).fetch();
      if(deletedReminder.length>0){
        return res.status(HTTP_STATUS.SUCCESS).json({
          message: req.i18n.__('REMINDER_DELETED'),
          deletedReminder
        });
      }
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        message: req.i18n.__('SERVER_ERROR'),
        error: error.message
      });
    }
  },

  // upcomingReminder action is used to get all the upcoming Reminders
  upcomingReminder: async(req,res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne(userId);
      if(!user){
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          message: req.i18n.__('USER_NOT_FOUND')
        });
      }
      const upComingReminder = await Reminder.find({
        createdBy:userId,
        // Here we are converting todays date into string and checking that it is greater than or equal to todays date
        dueDate: { '>=': new Date().toISOString() }
      });
      if (upComingReminder.length <= 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          message: req.i18n.__('NO_UPCOMING_REMINDER')
        });
      }
      res.status(HTTP_STATUS.SUCCESS).json({
        message: req.i18n.__('UPCOMING_REMINDERS'),
        upComingReminder
      });
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        message: req.i18n.__('SERVER_ERROR'),
        error: error.message
      });
    }
  },

  // pushNotification action is used to push the todays notification
  // Here we are logging the notification to console
  pushNotification: async(req,res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne(userId);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          message: req.i18n.__('USER_NOT_FOUND')
        });
      }
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      // Here we format the date string as YYYY-MM-DD
      const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      const remindingMessage = await Reminder.find({ createdBy: userId, dueDate: formattedDate });
      remindingMessage.forEach(async (reminder) => {
        console.log(`Sending reminder notification for user ${userId}: ${reminder.description}`);
      });

      return res.status(HTTP_STATUS.SUCCESS).json({
        message: req.i18n.__('PUSH_NOTIFICATION'),
        remindingMessage
      });
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        message: req.i18n.__('SERVER_ERROR'),
        error: error.message
      });
    }
  }
};

