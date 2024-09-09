import { expect } from 'chai';
import sinon from 'sinon';
import { TaskService } from '../services/taskService';
import { TaskRepository } from '../repositories/taskRepository';
import { Task } from '../models/Task';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: sinon.SinonStubbedInstance<TaskRepository>;

  beforeEach(() => {
    taskRepository = sinon.createStubInstance(TaskRepository);
    taskService = new TaskService();
    (taskService as any).taskRepository = taskRepository;  // Inject the mocked repo
  });

  it('should create a new task', async () => {
    const mockTask: Partial<Task> = {
      title: 'New Task',
      description: 'Task description',
      dueDate: new Date(),
      priority: 'high',
      assignedMember: 'John Doe',
    };

    taskRepository.createTask.resolves(mockTask as Task);

    const task = await taskService.createTask(mockTask);
    expect(task.title).to.equal('New Task');
    expect(taskRepository.createTask.calledOnce).to.be.true;
  });

  it('should update task status to completed and set completion date', async () => {
    const mockTask: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description',
      dueDate: new Date(),
      priority: 'high',
      assignedMember: 'John Doe',
      status: 'pending',
      completionDate: null,
    };

    taskRepository.updateTaskStatus.resolves({
      ...mockTask,
      status: 'completed',
      completionDate: new Date(),
    });

    const updatedTask = await taskService.updateTaskStatus(1, 'completed');
    expect(updatedTask?.status).to.equal('completed');
    expect(updatedTask?.completionDate).to.be.a('date');
    expect(taskRepository.updateTaskStatus.calledOnce).to.be.true;
  });

  it('should generate a report for tasks completed by a member', async () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', description: 'Desc 1', dueDate: new Date(), priority: 'high', assignedMember: 'John Doe', status: 'completed', completionDate: new Date() },
      { id: 2, title: 'Task 2', description: 'Desc 2', dueDate: new Date(), priority: 'low', assignedMember: 'John Doe', status: 'completed', completionDate: new Date() },
    ];

    taskRepository.getCompletedTasksByMember.resolves(mockTasks);

    const report = await taskService.generateReportByMember('John Doe');
    expect(report.completedTasks).to.equal(2);
    expect(report.averageCompletionTime).to.be.a('number');
    expect(taskRepository.getCompletedTasksByMember.calledOnce).to.be.true;
  });
});
