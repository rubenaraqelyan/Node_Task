import { AppDataSource } from '../database';
import { Task } from '../models/Task';
import { Between } from 'typeorm';

export class TaskRepository {
  private taskRepository = AppDataSource.getRepository(Task);

  async createTask(task: Partial<Task>): Promise<Task> {
    const newTask = this.taskRepository.create(task);
    return await this.taskRepository.save(newTask);
  }

  async updateTaskStatus(id: number, status: string): Promise<Task | null> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) return null;
    task.status = status;
    if (status === 'completed') task.completionDate = new Date();
    return await this.taskRepository.save(task);
  }

  async findTaskById(id: number): Promise<Task | null> {
    return await this.taskRepository.findOneBy({ id });
  }

  async getCompletedTasksByMemberAndPeriod(
    member?: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<Task[]> {
    const whereClause: any = {
      status: 'completed',
    };

    if (member) whereClause.assignedMember = member;
    if (startDate && endDate) {
      whereClause.completionDate = Between(startDate, endDate);
    }

    return await this.taskRepository.find({ where: whereClause });
  }
}
