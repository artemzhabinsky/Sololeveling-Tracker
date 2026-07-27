import { useTaskStore } from '../../state/useTaskStore.js'
import TaskForm from './TaskForm.jsx'

const RANK_TONE = {
  E: 'text-moss',
  D: 'text-moss',
  C: 'text-jade',
  B: 'text-jade',
  A: 'text-gold',
  S: 'text-gold',
}

export default function TaskListView() {
  const tasks = useTaskStore((s) => s.tasks)
  const createTask = useTaskStore((s) => s.createTask)
  const completeTask = useTaskStore((s) => s.completeTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  return (
    <div className="space-y-6">
      <TaskForm onSubmit={createTask} />

      {tasks.length === 0 ? (
        <p className="border border-dashed border-edge px-4 py-8 text-center text-moss">
          Пока пусто. Добавь первую задачу — опыт начислится сразу после выполнения.
        </p>
      ) : (
        <ul className="divide-y divide-edge border-y border-edge">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-wrap items-center gap-3 py-3 transition-colors hover:bg-raised"
            >
              <span
                aria-hidden="true"
                className={`sys-value w-6 shrink-0 text-center text-sm ${RANK_TONE[task.rank] ?? 'text-moss'}`}
              >
                {task.rank}
              </span>
              <span
                className={`min-w-0 flex-1 break-words ${
                  task.status === 'done' ? 'text-ash line-through' : 'text-bone'
                }`}
              >
                {task.title}
              </span>
              {task.status !== 'done' && (
                <button type="button" onClick={() => completeTask(task.id)}>
                  Выполнить
                </button>
              )}
              <button
                type="button"
                className="sys-btn-quiet sys-btn-danger"
                onClick={() => deleteTask(task.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
