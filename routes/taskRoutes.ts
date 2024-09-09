import express from 'express';
import { createTask, updateTaskStatus, generateReport } from '../controllers/taskController';

const router = express.Router();

router.post('/tasks', createTask);
router.put('/tasks/status', updateTaskStatus);
router.get('/tasks/report', generateReport);

export default router;
