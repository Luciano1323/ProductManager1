const ERROR_DICTIONARY = require('../utils/errorDictionary');

const errorHandler = (err, req, res, next) => {
  const error = ERROR_DICTIONARY[err.message] || ERROR_DICTIONARY.INTERNAL_SERVER_ERROR;
  res.status(error.code).json({ error: error.message });
};

module.exports = errorHandler;