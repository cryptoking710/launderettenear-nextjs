import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../firebase-admin";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Auth failed: No token provided");
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      };
      
      next();
    } catch (verifyError: any) {
      console.error("Token verification error:", verifyError.message);
      return res.status(401).json({ 
        error: "Unauthorized - Invalid or expired token",
        details: verifyError.message 
      });
    }
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Authentication error" });
  }
}
