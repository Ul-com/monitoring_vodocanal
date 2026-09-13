import { Request, Response } from 'express';
import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { Object } from '../types';

export const getAllObjects = (req: Request, res: Response) => {
  res.json(db.objects);
};

export const getObject = (req: Request, res: Response) => {
  const obj = db.findObject(req.params.id);
  if (!obj) return res.status(404).json({ error: 'Object not found' });
  res.json(obj);
};

export const createObject = (req: Request, res: Response) => {
  const data = req.body;
  const newObj: Object = {
    id: uuidv4(),
    name: data.name,
    type: data.type || 'other',
    address: data.address,
    lat: data.lat,
    lng: data.lng,
    description: data.description || '',
    createdAt: new Date().toISOString(),
    status: 'green',
    devices: data.devices || [],
  };
  db.objects.push(newObj);
  res.status(201).json(newObj);
};

export const updateObject = (req: Request, res: Response) => {
  const obj = db.findObject(req.params.id);
  if (!obj) return res.status(404).json({ error: 'Object not found' });
  Object.assign(obj, req.body);
  res.json(obj);
};

export const deleteObject = (req: Request, res: Response) => {
  const idx = db.objects.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Object not found' });
  db.objects.splice(idx, 1);
  res.status(204).send();
};