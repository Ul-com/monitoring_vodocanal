import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid'; // нужно добавить в зависимости

// Для простоты будем генерировать одно событие каждые 30 секунд (в пилоте)
export function startSimulation() {
  setInterval(() => {
    // Выбираем случайный объект
    const objects = db.objects;
    if (objects.length === 0) return;
    const obj = objects[Math.floor(Math.random() * objects.length)];
    
    // Типы событий
    const eventTypes = [
      { type: 'Клонирование IMEI', desc: `Обнаружено дублирование IMEI на устройстве ${obj.devices[0]?.imei || 'неизвестно'}`, priority: 'high' },
      { type: 'Подмена IMEI', desc: `Зафиксирована смена IMEI без заявки`, priority: 'high' },
      { type: 'Вандализм', desc: 'Сработал геркон и пропал heartbeat', priority: 'high' },
      { type: 'Потеря связи', desc: 'Нет heartbeat более 10 минут', priority: 'medium' },
      { type: 'Смена APN', desc: 'APN изменён на публичный', priority: 'medium' },
    ];
    const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    // Создаём аларм
    const alert = {
      id: uuidv4(),
      objectId: obj.id,
      deviceId: obj.devices[0]?.id || undefined,
      type: event.type,
      description: event.desc,
      priority: event.priority as 'high' | 'medium' | 'low',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };
    db.alerts.push(alert);
    
    // Меняем статус объекта на жёлтый или красный
    if (event.priority === 'high') {
      obj.status = 'red';
    } else {
      obj.status = 'yellow';
    }
    // Обновляем статусы устройств (для демонстрации)
    obj.devices.forEach(d => d.status = obj.status);
    
    console.log(`[Simulation] Новый аларм: ${event.type} на объекте ${obj.name}`);
  }, 30000); // каждые 30 секунд
}