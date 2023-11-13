import router from './config/router.config';
import DeviceController from './controllers/device.controller';
import ServerController from './controllers/server.controller';
import WaterMeasurementController from './controllers/waterMeasurement.controller';

router.get('/', ServerController.index);
router.get('/devices', DeviceController.index);
router.post('/devices', DeviceController.store);
router.put('/devices/:id', DeviceController.update);
router.delete('/devices/:id', DeviceController.delete);
router.get('/devices/:id/water_measurements', WaterMeasurementController.index);
router.get(
  '/devices/:id/water_measurements/biggest_expense',
  WaterMeasurementController.biggestExpense
);
router.get(
  '/devices/:id/water_measurements/lowest_expense',
  WaterMeasurementController.lowestExpense
);

export default router;
