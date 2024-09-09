import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { ErrorMessages } from '../utils/errorMessages';

const taskService = new TaskService();

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask(req.body);

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;
    const updatedTask = await taskService.updateTaskStatus(id, status);
    if (!updatedTask) return res.status(404).json({ error: ErrorMessages.TASK_NOT_FOUND });

    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export const generateReport = async (req: Request, res: Response) => {
    try {
        const { member, startDate, endDate } = req.query;
        const report = await taskService.generateReportByMemberAndPeriod(member as string, startDate as string, endDate as string);
        
        return res.json(report);
      } catch (error) {
        return res.status(500).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
      }
};
