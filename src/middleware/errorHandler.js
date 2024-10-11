import { errorDictionary } from '../utils/errorDictionary.js';

export function errorHandler(err, req, res, next) {
  const error = errorDictionary[err.message] || {
    code: 500,
    message: 'Internal Server Error',
  };
  res.status(error.code).json({ error: error.message });
}
