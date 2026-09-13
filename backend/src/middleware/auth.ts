import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // В пилоте пропускаем все запросы, но можно добавить проверку токена
  next();
};