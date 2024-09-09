import { TaskRepository } from '../repositories/taskRepository';
import { Task } from '../models/Task';

export class TaskService {
  private taskRepository = new TaskRepository();

  async createTask(taskData: Partial<Task>): Promise<Task> {
    return this.taskRepository.createTask(taskData);
  }

  async updateTaskStatus(id: number, status: string): Promise<Task | null> {
    return this.taskRepository.updateTaskStatus(id, status);
  }

  async generateReportByMemberAndPeriod(
    member?: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<any> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const tasks = await this.taskRepository.getCompletedTasksByMemberAndPeriod(member, start, end);
    const completedCount = tasks.length;

      const totalTime = tasks.reduce((acc, task) => {
      const completionTime = (new Date(task.completionDate).getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24);
      return acc + completionTime;
    }, 0);

    return {
      completedTasks: completedCount,
      averageCompletionTime: completedCount > 0 ? totalTime / completedCount : 0, 
    };
  }
}
