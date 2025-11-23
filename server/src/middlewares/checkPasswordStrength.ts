import { type Request, type Response, type NextFunction } from "express";
import zxcvbn from "zxcvbn";

export function checkPasswordStrength(
  req: Request,
  res: Response,
  next: NextFunction,
) {

  
  const password  = req.body.newPassword || req.body.password;

  //validate presence of a password or newPassword
  if (!req.body.newPassword && !req.body.password) {
  return res.status(400).json({
    message: "Please provide a 'newPassword' (for updates) or 'password' (for registration).",
  });
}


  //check password strength
  const result = zxcvbn(password);

  //zxcvbn score range: 0 (weak) -> 4 (very strong)
  if (result.score < 3) {
    res.status(400).json({ message: "Please use a stronger password. Try mixing uppercase, lowercase, numbers, and special characters.", suggestions: result.feedback.suggestions, });
    return;
  }

  //attach strength info to request (mine to test)
  req.body.passwordStrength = result.score;

  next();
}
