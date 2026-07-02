import { verifyJWTToken } from "../utils/jwt.utils.js";

export const verifyJWT = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. No token provided."
    });
  }

  try {
    const decoded = verifyJWTToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Forbidden access. Invalid or expired token."
    });
  }
};

// Use after verifyJWT to ensure the email in the token matches the
// email being queried/operated on (e.g. for /my-bookings?email=...)
export const verifyTokenEmail = (req, res, next) => {
  const queryEmail = req.query.email;

  if (queryEmail && queryEmail !== req.decoded?.email) {
    return res.status(403).json({
      success: false,
      message: "Forbidden access. Email mismatch."
    });
  }

  next();
};
