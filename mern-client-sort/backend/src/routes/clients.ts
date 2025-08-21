import { Router } from 'express';
import { getClients } from '../controllers/clientController';

const router = Router();

// GET /api/clients
router.get('/', getClients);

export default router;
