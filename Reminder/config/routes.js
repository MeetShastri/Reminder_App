/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'POST /registeruser':'UserController.register',
  'POST /loginuser' : 'UserController.login',
  'POST /addreminder' : 'ReminderController.addReminder',
  'GET /getallreminder' : 'ReminderController.getReminders',
  'GET /getreminders/:id' : 'ReminderController.getReminder',
  'PUT /updatereminder/:reminderId' : 'ReminderController.updateReminder',
  'DELETE /deletereminder/:reminderId' : 'ReminderController.deleteReminder',
  'GET /upcomingreminder/:id' : 'ReminderController.upcomingReminder',
  'GET /pushnotification/:id' : 'ReminderController.pushNotification'
};
