import jwt from 'jsonwebtoken';

const AuthUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: 'Unauthorized' });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id; 
    next();
    req.userId = token_decode.id;


  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default AuthUser;
