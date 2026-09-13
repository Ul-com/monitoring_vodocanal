import { Request, Response } from 'express';
import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';

export const getAllUsers = (req: Request, res: Response) => {
  // Не возвращаем пароли
  res.json(db.users.map(({ password, ...rest }) => rest));
};

export const getUser = (req: Request, res: Response) => {
  const user = db.findUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...rest } = user;
  res.json(rest);
};

export const createUser = (req: Request, res: Response) => {
  const data = req.body;
  const newUser: User = {
    id: uuidv4(),
    name: data.name,
    email: data.email,
    role: data.role,
    password: data.password || 'default',
    active: true,
  };
  db.users.push(newUser);
  const { password, ...rest } = newUser;
  res.status(201).json(rest);
};

export const updateUser = (req: Request, res: Response) => {
  const user = db.findUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  Object.assign(user, req.body);
  const { password, ...rest } = user;
  res.json(rest);
};

export const deleteUser = (req: Request, res: Response) => {
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  db.users.splice(idx, 1);
  res.status(204).send();
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = db.findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const { password: _, ...rest } = user;
  res.json({ user: rest, token: 'fake-jwt-token' }); // в пилоте токен не проверяем
};