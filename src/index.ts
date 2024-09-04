import express from 'express';
import { AppDataSource } from './database';
import couponRoutes from './routes/couponRoutes';

const app = express();

app.use(express.json());
app.use('/api', couponRoutes);

AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => console.log(error));
