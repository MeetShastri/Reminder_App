// Here we are specifing all the status code which will be used in our actions

module.exports = {
  HTTP_STATUS:{
    SUCCESS: 200,
    CREATED:201,
    ALREADY_EXISTS:203,
    BAD_REQUEST:400,
    FORBIDDEN:403,
    NOT_FOUND:404,
    SERVER_ERROR:500,
  },
  bcrypt: require('bcrypt'),
  jwt:require('jsonwebtoken'),
};
