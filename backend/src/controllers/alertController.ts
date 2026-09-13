import { Request, Response } from 'express';
import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid';

export const getAllAlerts = (req: Request, res: Response) => {
  res.json(db.alerts);
};

export const getAlert = (req: Request, res: Response) => {
  const alert = db.findAlert(req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
};

export const createAlert = (req: Request, res: Response) => {
  const data = req.body;
  const newAlert = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
    status: data.status || 'active',
  };
  db.alerts.push(newAlert);
  res.status(201).json(newAlert);
};

export const resolveAlert = (req: Request, res: Response) => {
  const alert = db.findAlert(req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.status = 'resolved';
  alert.resolvedAt = new Date().toISOString();
  // Если все алармы объекта закрыты, можно изменить статус объекта, но для простоты оставим
  res.json(alert);
};