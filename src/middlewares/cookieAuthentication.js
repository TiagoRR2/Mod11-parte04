import { findToken } from "../src/database/manager/AuthTokens";

export default async function authenticationMiddleware(req, res, next) {
  if (req.cookies.auth) {
    const tokenInfo = findToken(req.cookies.auth);
    if (tokenInfo) {
      req.authenticationInfo = tokenInfo;
      return next();
    }
  }

  req.authenticationInfo = null;
  next();
}
