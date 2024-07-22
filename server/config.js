module.exports = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  session: {
    cookieKey: process.env.COOKIE_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET, 
  }
};