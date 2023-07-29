import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, 'somesupersecretsecret');
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
};

export { isAuth };