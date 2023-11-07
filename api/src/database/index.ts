import { Client, types } from 'pg';

types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'root',
  database: 'water_tank_monitoring',
});

client.connect();

export default client;
