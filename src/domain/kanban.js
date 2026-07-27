export function columnsFromTasks(tasks) {
  return {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  }
}

export function moveTask(tasks, taskId, newStatus) {
  return tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
}
