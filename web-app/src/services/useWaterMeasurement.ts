import { useCallback } from 'react';
import api from '../config/api';

export default function useWaterMeasurement() {
  const path = '/water_measurements';

  const getWaterMeasurements = useCallback(async (params: any) => {
    try {
      const response = await api.get(path, { params });
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  const getBiggestExpense = useCallback(async () => {
    try {
      const response = await api.get(path + '/biggest_expense');
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  const getLowestExpense = useCallback(async () => {
    try {
      const response = await api.get(path + '/lowest_expense');
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  return { getWaterMeasurements, getBiggestExpense, getLowestExpense };
}
