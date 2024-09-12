import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

interface DecodedToken {
  user_id: string;
  role: 'superadmin' | 'regular';
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as DecodedToken;
    req.body.loggedUser = decoded;
    req.params.id = decoded.user_id;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError)
      res.status(401).json({ message: "Token Expired", error });
    else
      res.status(401).json({ message: "Token Invalid", error });
  }
};

auth.isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.loggedUser && req.body.loggedUser.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Superadmin role required." });
  }
};

export default auth;