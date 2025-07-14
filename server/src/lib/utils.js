import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const generateToken = (user, res) => {
  dotenv.config();
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie.
    sameSite: "strict", // Helps prevent CSRF attacks by ensuring the cookie is sent only in same-site requests.
    // Note: 'secure' should be set to true in production environments to ensure cookies are sent over HTTPS.
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production but not in development
  });

  return token;
};
