import jwt from 'jsonwebtoken';

export default ({ req }) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    throw new Error('Authorization header must be provided');
  }

  const token = authHeader.split(' ')[1];

  if (!token || token === '') {
    throw new Error('Authentication header must be provided');
  }

  try {
    // Validating token
    const decodedToken = jwt.verify(token, 'testString');

    req.userId = decodedToken.userId;
    return decodedToken;
  } catch (e) {
    throw new Error('Invalid Token');
  }
};
