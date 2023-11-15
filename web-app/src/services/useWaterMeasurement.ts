import { useCallback } from 'react';
import api from '../config/api';

export default function useWaterMeasurement() {
  const path = 'water_measurements';

  const getWaterMeasurements = useCallback(async (id: string, params: any) => {
    try {
      const response = await api.get(`/devices/${id}/${path}`, { params });
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message };
    }
  }, []);

  const getBiggestExpense = useCallback(async (id: string) => {
    try {
      const response = await api.get(`devices/${id}/${path}/biggest_expense`);
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message };
    }
  }, []);

  const getLowestExpense = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/devices/${id}/${path}/lowest_expense`);
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message };
    }
  }, []);

  return { getWaterMeasurements, getBiggestExpense, getLowestExpense };
}
