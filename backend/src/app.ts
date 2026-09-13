import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());
app.use(authMiddleware);
app.use('/api', routes);

// В продакшене тот же процесс отдаёт собранный фронтенд, поэтому прокси не нужен.
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

app.use(errorHandler);

export default app;
