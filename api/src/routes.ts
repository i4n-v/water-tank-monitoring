import router from './config/router.config';
import ServerController from './controllers/server.controller';
import WaterMeasurementController from './controllers/waterMeasurement.controller';

router.get('/', ServerController.index);
router.get('/water_measurements', WaterMeasurementController.index);
router.get('/water_measurements/biggest_expense', WaterMeasurementController.biggestExpense);
router.get('/water_measurements/lowest_expense', WaterMeasurementController.lowestExpense);

export default router;
