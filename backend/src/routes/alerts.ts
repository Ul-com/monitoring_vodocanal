import { Router } from 'express';
import { getAllAlerts, getAlert, createAlert, resolveAlert } from '../controllers/alertController';

const router = Router();
router.get('/', getAllAlerts);
router.get('/:id', getAlert);
router.post('/', createAlert);
router.patch('/:id/resolve', resolveAlert);

export default router;