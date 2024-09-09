import { expect } from 'chai';
import request from 'supertest';
import {app} from '../server';

describe('Task API', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Task 1',
        description: 'Description 1',
        dueDate: '2024-09-15',
        priority: 'high',
        assignedMember: 'John'
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });

  it('should update task status', async () => {
    const res = await request(app)
      .put('/api/tasks/status')
      .send({ id: 1, status: 'completed' });
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('completed');
  });
});
