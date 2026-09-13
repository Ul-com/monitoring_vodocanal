# Пилот «Мониторинг рисков IoT»

Backend: Express + TypeScript (данные в памяти, моки).
Frontend: React + Vite + Ant Design + MapLibre GL.

## Запуск на Windows

### 1. Установить Node.js

Скачать LTS-версию (20 или 22) с https://nodejs.org и установить.
Проверить в терминале:

```
node -v
npm -v
```

### 2. Распаковать проект

Распаковать `pilot-windows.zip` в короткий путь без кириллицы, например `C:\pilot`.
Должно получиться `C:\pilot\project-root\backend` и `C:\pilot\project-root\frontend`.

Зависимости (`node_modules`) в архив не входят — их нужно установить на месте,
переносить между macOS и Windows нельзя из-за платформенных бинарников.

### 3. Запустить backend (первое окно терминала)

```
cd C:\pilot\project-root\backend
npm install
npm run dev
```

Должно появиться: `Backend running on http://localhost:5001`.
Окно не закрывать.

### 4. Запустить frontend (второе окно терминала)

```
cd C:\pilot\project-root\frontend
npm install
npm run dev
```

Должно появиться: `Local: http://localhost:5173/`.

### 5. Открыть приложение

http://localhost:5173

Тестовые учётные записи:

| Роль      | Логин                  | Пароль   |
|-----------|------------------------|----------|
| Админ     | admin@example.com      | admin123 |
| Инженер   | engineer@example.com   | eng123   |
| Наблюдатель | viewer@example.com   | view123  |

## Если что-то не работает

**PowerShell пишет «выполнение сценариев отключено»** — запустить те же команды в
`cmd`, либо один раз выполнить в PowerShell от своего пользователя:

```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Порт 5001 занят** — поменять его в двух местах сразу:
`backend/.env` (`PORT=`) и `frontend/vite.config.ts` (цель прокси `/api`).

**Карта не отображается** — нужен доступ в интернет к `tiles.openfreemap.org`,
оттуда грузятся тайлы и шрифты.

## Особенности пилота

- База не используется: объекты, алармы и пользователи хранятся в памяти
  процесса и генерируются моками, при перезапуске backend данные сбрасываются.
- Аутентификация условная: токен не проверяется, пароли лежат открытым текстом.
  Для продуктива это нужно переделать.
