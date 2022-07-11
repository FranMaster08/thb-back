export default {
  jwtIssuer: process.env.JWT_ISSUER,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtExpiration: parseInt(process.env.JWT_EXPIRATION, 10),
  saltLength: 8,
  adfsLoginUrl: process.env.ADFS_LOGIN_URL,
  adfsLoginApikey: process.env.ADFS_LOGIN_APIKEY,
};
