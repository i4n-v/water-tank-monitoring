import { Client } from 'pg';
import client from '../database';
import IWaterMeasurement from '../@types/waterMeasurement.type';

class WaterMeasurementRepositorie {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async findAndCountAllByDeviceId(id: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const {
      rows: [count],
    } = await this.client.query('SELECT COUNT(id) FROM water_measurements WHERE device_id = $1', [
      id,
    ]);

    const { rows } = await this.client.query(
      `
      SELECT * 
      FROM water_measurements 
      WHERE device_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
    `,
      [id, limit, offset]
    );

    const result = {
      count: count.count as number,
      rows: rows as IWaterMeasurement[],
    };

    return result;
  }

  async findLastByDeviceId(id: string) {
    const {
      rows: [row],
    } = await this.client.query(
      'SELECT * FROM water_measurements WHERE device_id = $1 ORDER BY created_at DESC LIMIT 1',
      [id]
    );

    return (row || null) as IWaterMeasurement | null;
  }

  async findBiggesExpenseByDeviceId(id: string) {
    const {
      rows: [row],
    } = await this.client.query(
      'SELECT * FROM water_measurements WHERE device_id = $1 ORDER BY spent_volume DESC LIMIT 1',
      [id]
    );

    return (row || null) as IWaterMeasurement | null;
  }

  async findLowestExpenseByDeviceId(id: string) {
    const {
      rows: [row],
    } = await this.client.query(
      'SELECT * FROM water_measurements WHERE device_id = $1 ORDER BY spent_volume ASC LIMIT 1',
      [id]
    );

    return (row || null) as IWaterMeasurement | null;
  }

  async create({
    device_id,
    total_volume,
    current_volume,
    spent_volume,
    percentage,
  }: Omit<IWaterMeasurement, 'id' | 'created_at' | 'updated_at'>) {
    const currentDate = new Date();

    const {
      rows: [row],
    } = await this.client.query(
      `
      INSERT INTO water_measurements(device_id, total_volume, current_volume, spent_volume, percentage, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [device_id, total_volume, current_volume, spent_volume, percentage, currentDate, currentDate]
    );

    return row as IWaterMeasurement;
  }
}

export default new WaterMeasurementRepositorie(client);
