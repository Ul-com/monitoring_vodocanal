import app from './app';
import { startSimulation } from './services/simulationService';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  // Запускаем симуляцию
  startSimulation();
});