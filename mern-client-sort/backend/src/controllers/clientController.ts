import { Request, Response, NextFunction } from 'express';
import { Client } from '../models/Client';

export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    next(err);
  }
};
