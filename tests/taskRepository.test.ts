import { expect } from 'chai';
import sinon from 'sinon';
import { TaskRepository } from '../repositories/taskRepository';
import { AppDataSource } from '../database';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let mockRepository: any;

  before(() => {
    mockRepository = {
      create: sinon.stub(),
      save: sinon.stub(),
      findOneBy: sinon.stub(),
      find: sinon.stub(),
    };
    sinon.stub(AppDataSource, 'getRepository').returns(mockRepository);
    taskRepository = new TaskRepository();
  });

  after(() => {
    sinon.restore();
  });

  it('should create and save a new task', async () => {
    const mockTask = {
      title: 'Test Task',
      description: 'Task description',
      dueDate: new Date(),
      priority: 'high',
      assignedMember: 'John',
    };
    mockRepository.create.returns(mockTask);
    mockRepository.save.resolves(mockTask);

    const createdTask = await taskRepository.createTask(mockTask);
    expect(createdTask).to.deep.equal(mockTask);
    expect(mockRepository.create.calledOnce).to.be.true;
    expect(mockRepository.save.calledOnce).to.be.true;
  });

  it('should update task status and set completion date if completed', async () => {
    const mockTask = {
      id: 1,
      status: 'pending',
      dueDate: new Date(),
    };
    mockRepository.findOneBy.resolves(mockTask);
    mockRepository.save.resolves({ ...mockTask, status: 'completed', completionDate: new Date() });

    const updatedTask = await taskRepository.updateTaskStatus(1, 'completed');
    expect(updatedTask?.status).to.equal('completed');
    expect(updatedTask?.completionDate).to.be.a('date');
  });

  it('should return null if task not found for status update', async () => {
    mockRepository.findOneBy.resolves(null);
    const updatedTask = await taskRepository.updateTaskStatus(999, 'completed');
    expect(updatedTask).to.be.null;
  });

  it('should find completed tasks by member', async () => {
    const mockTasks = [{ id: 1, assignedMember: 'John', status: 'completed' }];
    mockRepository.find.resolves(mockTasks);

    const tasks = await taskRepository.getCompletedTasksByMemberAndPeriod('John');
    expect(tasks).to.have.length(1);
    expect(tasks[0].assignedMember).to.equal('John');
  });
});
