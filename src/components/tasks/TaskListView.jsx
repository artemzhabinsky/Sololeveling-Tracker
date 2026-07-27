import { useTaskStore } from '../../state/useTaskStore.js'
import TaskForm from './TaskForm.jsx'

export default function TaskListView() {
  const tasks = useTaskStore((s) => s.tasks)
  const createTask = useTaskStore((s) => s.createTask)
  const completeTask = useTaskStore((s) => s.completeTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  return (
    <div>
      <TaskForm onSubmit={createTask} />
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.title}</span>
            {task.status !== 'done' && (
              <button type="button" onClick={() => completeTask(task.id)}>Выполнить</button>
            )}
            <button type="button" onClick={() => deleteTask(task.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
