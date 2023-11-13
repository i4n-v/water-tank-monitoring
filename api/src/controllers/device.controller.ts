import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import DeviceRepositorie from '../repositories/device.repositorie';
import paginationWrapper from '../utils/paginationWrapper';
import IDevice from '../@types/device.type';

class DeviceController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { query } = request;
      const page = query.page ? parseInt(query.page as unknown as string) : 1;
      const limit = query.limit ? parseInt(query.limit as unknown as string) : 75;

      const devices = await DeviceRepositorie.findAndCountAll(page, limit);
      const result = paginationWrapper(devices, page, limit);

      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async store(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, description }: Omit<IDevice, 'id' | 'created_at' | 'updated_at'> = request.body;

      await DeviceRepositorie.create({ name, description });

      return response.json({ message: 'Dispositivo criado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const { name, description }: Omit<IDevice, 'id' | 'created_at' | 'updated_at'> = request.body;

      await DeviceRepositorie.update(id, { name, description });

      return response.json({ message: 'Dispositivo atualizado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const device = await DeviceRepositorie.findById(id);

      if (device) {
        return response.status(401).json({ message: 'Dipositivo não encontrado.' });
      }

      await DeviceRepositorie.delete(id);

      return response.json({ message: 'Dispositivo excluido com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
}

export default new DeviceController();
