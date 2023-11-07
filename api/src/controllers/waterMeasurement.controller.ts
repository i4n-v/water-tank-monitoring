import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import WaterMeasurementsRepositorie from '../repositories/waterMeasurements.repositorie';
import paginationWrapper from '../utils/paginationWrapper';

class WaterMeasurementController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { query } = request;
      const page = query.page ? parseInt(query.page as unknown as string) : 1;
      const limit = query.limit ? parseInt(query.limit as unknown as string) : 75;

      const waterMeasurements = await WaterMeasurementsRepositorie.findAndCountAll(page, limit);
      const result = paginationWrapper(waterMeasurements, page, limit);

      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async biggestExpense(request: Request, response: Response, next: NextFunction) {
    try {
      const biggesExpense = await WaterMeasurementsRepositorie.findBiggesExpense();

      if (biggesExpense) {
        return response.status(404).json({ message: 'Nenhuma medição de água encontrada.' });
      }

      return response.json(biggesExpense);
    } catch (error) {
      next(error);
    }
  }

  async lowestExpense(request: Request, response: Response, next: NextFunction) {
    try {
      const lowestExpense = await WaterMeasurementsRepositorie.findLowestExpense();

      if (lowestExpense) {
        return response.status(404).json({ message: 'Nenhuma medição de água encontrada.' });
      }

      return response.json(lowestExpense);
    } catch (error) {
      next(error);
    }
  }
}

export default new WaterMeasurementController();
