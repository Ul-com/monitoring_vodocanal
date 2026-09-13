import { Router } from 'express';
import { getAllObjects, getObject, createObject, updateObject, deleteObject } from '../controllers/objectController';

const router = Router();
router.get('/', getAllObjects);
router.get('/:id', getObject);
router.post('/', createObject);
router.put('/:id', updateObject);
router.delete('/:id', deleteObject);

export default router;