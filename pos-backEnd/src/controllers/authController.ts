import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { createJwt } from "../utils/jwt.util";
import ApiError from "../utils/ApiError";

//Registrtion

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, mobile, password } = req.body;
    const user = await authService.registerUser(name, mobile, password);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//Login

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      throw new ApiError(400, "Mobile and password are required");
    }

    const user = await authService.loginUser(mobile, password);

    const token = createJwt({
      sub: (user as any)._id.toString(),
      mobile: user.mobile,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};