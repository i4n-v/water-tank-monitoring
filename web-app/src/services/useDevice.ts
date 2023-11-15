import { useCallback } from 'react';
import api from '../config/api';
import { IDevice } from '../@types/device';

export default function useDevice() {
  const path = '/devices';

  const getDevices = useCallback(async (params: any) => {
    try {
      const response = await api.get(path, { params });
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message };
    }
  }, []);

  const postDevice = useCallback(async (data: Omit<IDevice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await api.post(path, data);
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message };
    }
  }, []);

  const updateDevice = useCallback(async (data: Omit<IDevice, 'created_at' | 'updated_at'>) => {
    try {
      const response = await api.put(`${path}/${data.id}`, data);
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message };
    }
  }, []);

  const deleteDevice = useCallback(async (id: string) => {
    try {
      const response = await api.delete(`${path}/${id}`);
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message };
    }
  }, []);

  return { getDevices, postDevice, updateDevice, deleteDevice };
}
