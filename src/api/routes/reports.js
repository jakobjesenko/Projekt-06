import { Router } from 'express';
import reportsController from '../controllers/reports.js';
import { protect, restrictTo } from '../middleware/auth.js';

const reportsRouter = Router();

reportsRouter.get('/', protect, restrictTo('admin'), reportsController.getAllReports);
reportsRouter.post('/', protect, restrictTo('admin', 'user'), reportsController.createReport);
reportsRouter.put(
	'/:reportId/status',
	protect,
	restrictTo('admin'),
	reportsController.updateReportStatus,
);
reportsRouter.delete('/:reportId', protect, restrictTo('admin'), reportsController.deleteReport);

export default reportsRouter;
