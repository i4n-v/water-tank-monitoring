import router from './config/router.config';
import DashBoardController from './controllers/dashboard.controller';

router.get('/', DashBoardController.index);

export default router;
