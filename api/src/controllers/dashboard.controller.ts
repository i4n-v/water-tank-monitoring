import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';

class DashboardController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      return response.json({ path: 'dashboard', active: true });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
