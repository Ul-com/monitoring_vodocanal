import { Router } from 'express';
import objectRoutes from './objects';
import alertRoutes from './alerts';
import userRoutes from './users';
import statisticsRoutes from './statistics';

const router = Router();
router.use('/objects', objectRoutes);
router.use('/alerts', alertRoutes);
router.use('/users', userRoutes);
router.use('/statistics', statisticsRoutes);

export default router;