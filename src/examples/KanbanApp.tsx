/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { StateDispatch, state$ } from '../hooks';

// Define types
interface Task {
  content: string;
  id: string;
}

interface Column {
  id: string;
  tasks: Task[];
  title: string;
}

interface KanbanAppState {
  columns: Column[];
  focusedInput: string | null;
}

// Define messages
interface KanbanMessage {
  AddTask: {
    columnId: string;
    task: Task;
  };
  MoveTask: {
    destinationColumnId: string;
    sourceColumnId: string;
    taskId: string;
  };
  SetFocusedInput: {
    columnId: string | null;
  };
}

// Kanban view component
function KanbanView({
  state,
  dispatch,
}: StateDispatch<KanbanAppState, KanbanMessage>) {
  const handleDragStart = (
    e: React.DragEvent,
    taskId: string,
    columnId: string
  ) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('columnId', columnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('columnId');
    dispatch('MoveTask', {
      sourceColumnId,
      destinationColumnId: columnId,
      taskId,
    });
  };

  const handleAddTask = (columnId: string, content: string) => {
    if (content.trim() !== '') {
      const newTask: Task = { id: `task${Date.now()}`, content };
      dispatch('AddTask', { columnId, task: newTask });
    }
  };

  const handleFocusInput = (columnId: string | null) => {
    dispatch('SetFocusedInput', { columnId });
  };

  return (
    <div className="kanban-board">
      {state.columns.map((column) => (
        <div
          key={column.id}
          className="column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <h2>{column.title}</h2>
          <ul>
            {column.tasks.map((task) => (
              <li
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id, column.id)}
              >
                {task.content}
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Enter new task"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTask(column.id, e.currentTarget.value);
                e.currentTarget.value = ''; // Clear input after adding task
              }
            }}
            onFocus={() => handleFocusInput(column.id)}
            onBlur={() => handleFocusInput(null)}
            autoFocus={state.focusedInput === column.id}
          />
        </div>
      ))}
    </div>
  );
}

// Kanban app component
export function KanbanApp() {
  // Sample initial state
  const initialState: KanbanAppState = {
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        tasks: [
          { id: 'task1', content: 'Task 1' },
          { id: 'task2', content: 'Task 2' },
        ],
      },
      {
        id: 'inProgress',
        title: 'In Progress',
        tasks: [],
      },
      {
        id: 'done',
        title: 'Done',
        tasks: [],
      },
    ],
    focusedInput: null,
  };

  // Reducer for handling messages
  const [state, dispatch] = state$<KanbanAppState, KanbanMessage>(
    initialState,
    [
      {
        messages: ['AddTask'],
        handler: (_state, payload) => {
          if ('columnId' in payload && 'task' in payload) {
            const { columnId, task } = payload;
            const column = _state.columns.find(
              (col) => col.id.get() === columnId
            );
            if (column) {
              column.tasks.push(task);
            }
          }
        },
      },
      {
        messages: ['MoveTask'],
        handler: (_state, payload) => {
          if (
            'sourceColumnId' in payload &&
            'destinationColumnId' in payload &&
            'taskId' in payload
          ) {
            console.log('moveTask', payload);
            const { sourceColumnId, destinationColumnId, taskId } = payload;
            const sourceColumn = _state.columns.find(
              (col) => col.id.get() === sourceColumnId
            );
            const destinationColumn = _state.columns
              .get()
              .find((col) => col.id === destinationColumnId);
            if (sourceColumn && destinationColumn) {
              const taskIndex = sourceColumn.tasks
                .get()
                .findIndex((task) => task.id === taskId);
              if (taskIndex !== -1) {
                const taskToMove = sourceColumn.tasks.splice(taskIndex, 1)[0];
                destinationColumn.tasks.push(taskToMove);
              }
            }
          }
        },
      },
    ]
  );

  return <KanbanView state={state} dispatch={dispatch} />;
}
