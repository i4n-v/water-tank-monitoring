import { Client } from 'pg';
import client from '../database';
import IDevice from '../@types/device.type';

class DeviceRepositorie {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async findById(id: string) {
    const {
      rows: [row],
    } = await this.client.query('SELECT * FROM devices WHERE id = $1', [id]);

    return (row || null) as IDevice | null;
  }

  async findAndCountAll(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const {
      rows: [count],
    } = await this.client.query('SELECT COUNT(id) FROM devices');

    const { rows } = await this.client.query(
      `
      SELECT * 
      FROM devices
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    const result = {
      count: count.count as number,
      rows: rows as IDevice[],
    };

    return result;
  }

  async create({ name, description }: Omit<IDevice, 'id' | 'created_at' | 'updated_at'>) {
    const currentDate = new Date();

    const {
      rows: [row],
    } = await this.client.query(
      `
      INSERT INTO water_measurements(name, description, created_at, updated_at)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `,
      [name, description, currentDate, currentDate]
    );

    return row as IDevice;
  }

  async update(
    id: string,
    { name, description }: Omit<IDevice, 'id' | 'created_at' | 'updated_at'>
  ) {
    const currentDate = new Date();

    const {
      rows: [row],
    } = await this.client.query(
      `
      UPDATE devices
      SET name = $1, description = $2, updated_at = $3
      WHERE id = $4
      RETURNING *
    `,
      [name, description, currentDate, id]
    );

    return row;
  }

  async delete(id: string) {
    const deleteOp = await this.client.query('DELETE FROM devices WHERE id = $1', [id]);
    return deleteOp;
  }
}

export default new DeviceRepositorie(client);
