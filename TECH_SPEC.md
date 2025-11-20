# Техническая Спецификация: Интерактивный ИИ‑канвас

## 1. Обзор

Этот документ описывает технические аспекты реализации проекта "Интерактивный ИИ‑канвас", включая стек технологий, модели данных, архитектуру и дизайн API.

## 2. Стек Технологий

| Компонент | Технология | Обоснование |
| :--- | :--- | :--- |
| **Frontend Framework** | React | Популярный, компонентно-ориентированный подход, идеально подходит для архитектуры Atomic Design. |
| **Визуализация графа**| React Flow (или аналог) | Библиотека для создания node-based UI. Управляет рендерингом, зумом, панорамированием и взаимодействием с нодами. |
| **Автоматическое расположение** | Dagre.js / Elkjs | Алгоритмические библиотеки для автоматического и "красивого" расположения нод и связей в графе. |
| **State Management** | Zustand / Redux Toolkit | Для управления состоянием графа (`Graph Model`) и состоянием UI. |
| **AI API** | OpenAI / Claude API | Для генерации графа из текстового ввода пользователя. |
| **Язык программирования** | TypeScript | Для статической типизации, что улучшает надежность и упрощает поддержку кода. |

## 3. Модели Данных

### 3.1. Graph Model

Единый источник правды для всего графа. Будет храниться в state-менеджере.

```typescript
interface GraphModel {
  nodes: Node[];
  edges: Edge[];
}
```

### 3.2. Node Entity

Представление отдельной ноды в графе.

```typescript
interface Node {
  id: string; // Уникальный идентификатор
  type: string; // Тип ноды (например, 'Action', 'Condition', 'Concept')
  position: { x: number; y: number }; // Координаты на канвасе
  data: {
    title: string;
    content?: string; // Опциональное описание
    icon?: string; // Иконка для заголовка
  };
  // Метаданные для валидации и бизнес-логики
  rules: {
    maxInConnections: number;
    maxOutConnections: number;
  };
}
```

### 3.3. Edge Entity

Представление связи между двумя нодами.

```typescript
interface Edge {
  id: string; // Уникальный идентификатор
  sourceNodeId: string; // ID исходной ноды
  targetNodeId: string; // ID целевой ноды
  label?: string; // Опциональная метка на связи
}
```

## 4. Дизайн API: AI Connector

Сервис `AI Connector` будет взаимодействовать с внешним API (например, OpenAI).

### Запрос (Request)

*   **Endpoint:** `/api/generate-graph`
*   **Method:** `POST`
*   **Body:**

```json
{
  "userInput": "Текст пользователя, например, 'схема воронки продаж'",
  "existingGraph": null // или GraphModel для доработки существующего графа
}
```

### Ответ (Response)

*   **Status:** `200 OK`
*   **Body:**

```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "Concept",
      "data": { "title": "Привлечение" }
    },
    {
      "id": "node-2",
      "type": "Action",
      "data": { "title": "Конверсия" }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "sourceNodeId": "node-1",
      "targetNodeId": "node-2"
    }
  ]
}
```
**Примечание:** `AI Connector` будет отвечать за преобразование ответа от внешнего API в эту структуру, а также за добавление координат (`position`) с помощью `AutoLayoutService` перед отправкой на клиент.
