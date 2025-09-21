import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define your token payload structure
interface DecodedToken {
  id: string;
  role: string; 
  iat?: number;
  exp?: number;
}

// Extend the Express Request interface to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: string;
    role?: string;
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.user = decoded.id; // Now `req.user` has proper type
    req.role = decoded.role // for storing role
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}; // not final yet

