import { signJWT } from "../utils/jwt.utils.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
};

export const issueJWT = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to issue a token"
      });
    }

    const token = signJWT({ email });

    res
      .cookie("token", token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({ success: true, message: "JWT issued successfully" });
  } catch (error) {
    next(error);
  }
};

export const logoutJWT = async (req, res, next) => {
  try {
    res
      .clearCookie("token", { ...cookieOptions, maxAge: 0 })
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
