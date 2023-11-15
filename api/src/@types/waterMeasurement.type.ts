interface IWaterMeasurement {
  id: string;
  device_id: string;
  total_volume: number;
  current_volume: number;
  spent_volume: number;
  percentage: number;
  created_at: string;
  updated_at: string;
}

export default IWaterMeasurement;
