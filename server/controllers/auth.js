const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateUniqueUsername = async (name) => {
  let username;
  let isUnique = false;

  while (!isUnique) {
    username =
      name.replace(/\s/g, "").toLowerCase().substring(0, 6) +
      Math.random().toString(36).substr(2, 6);

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return username;
};

const login = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new BadRequestError("Google ID Token is required");
  }

  try {
    let email, name, picture, googleId;

    if (idToken === "mock-google-token") {
      // Mock Data for Demo
      email = "demo@aniverse.com";
      name = "Demo User";
      picture = "https://ui-avatars.com/api/?name=Demo+User&background=random";
      googleId = "mock-google-id-12345";
    } else {
      // Real Google Verification
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
      googleId = payload.sub;
    }

    if (!email) {
      throw new BadRequestError("Google account does not have an email");
    }

    let user = await User.findOne({ email });

    if (user) {
      // Update googleId if not present (linking accounts)
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture) user.picture = picture;
        await user.save();
      }

      const accessToken = user.createAccessToken();
      const refreshToken = user.createRefreshToken();

      return res.status(StatusCodes.OK).json({
        user,
        tokens: { access_token: accessToken, refresh_token: refreshToken },
      });
    }

    // Create new user
    const username = await generateUniqueUsername(name || email.split("@")[0]);

    user = new User({
      email,
      username,
      name: name || email.split("@")[0],
      picture: picture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      googleId,
    });

    await user.save();

    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();

    res.status(StatusCodes.CREATED).json({
      user,
      tokens: { access_token: accessToken, refresh_token: refreshToken },
    });
  } catch (error) {
    console.error("Google verify error:", error);
    throw new UnauthenticatedError("Invalid Google Token");
  }
};

const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    throw new BadRequestError("Refresh token is required");
  }

  try {
    const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);

    if (!user) {
      throw new UnauthenticatedError("Invalid refresh token");
    }

    const newAccessToken = user.createAccessToken();
    const newRefreshToken = user.createRefreshToken();

    res.status(StatusCodes.OK).json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  } catch (error) {
    console.error(error);
    throw new UnauthenticatedError("Invalid refresh token");
  }
};

module.exports = {
  login,
  refreshToken,
};
