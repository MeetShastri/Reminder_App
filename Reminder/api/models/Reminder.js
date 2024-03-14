/**
 * Reminder.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    createdBy: {
      model: 'User',
      required: true
    },
    dueDate: {
      type: 'ref',
      columnType: 'date',
      required: true
    }
  },

};

