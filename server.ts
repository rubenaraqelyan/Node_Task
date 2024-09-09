import express from 'express';
import taskRoutes from './routes/taskRoutes';
import { AppDataSource } from './database';

export const app = express();
app.use(express.json());

app.use('/api', taskRoutes);

AppDataSource.initialize().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}).catch((error) => console.log(error));
