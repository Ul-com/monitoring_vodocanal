import { Request, Response } from 'express';
import { db } from '../db/database';

export const getStatistics = (req: Request, res: Response) => {
  const totalObjects = db.objects.length;
  const statusCounts = db.objects.reduce((acc, obj) => {
    acc[obj.status] = (acc[obj.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const alertsByType = db.alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const alertsByDay = db.alerts.reduce((acc, alert) => {
    const day = alert.createdAt.substring(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const activeAlerts = db.alerts.filter(a => a.status === 'active').length;
  const resolvedAlerts = db.alerts.filter(a => a.status === 'resolved').length;
  
  res.json({
    totalObjects,
    statusCounts,
    alertsByType,
    alertsByDay,
    activeAlerts,
    resolvedAlerts,
    // Дополнительные метрики
    averageDetectionTime: '2 мин', // заглушка
    averageResponseTime: '5 мин',
  });
};