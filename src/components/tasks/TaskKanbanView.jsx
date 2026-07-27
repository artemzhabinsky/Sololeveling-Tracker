import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { useTaskStore } from '../../state/useTaskStore.js'
import { columnsFromTasks } from '../../domain/kanban.js'

const COLUMN_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }

function KanbanCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {task.title}
    </div>
  )
}

function KanbanColumn({ status, tasks }) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div ref={setNodeRef} data-testid={`kanban-column-${status}`}>
      <h3>{COLUMN_LABELS[status]}</h3>
      {tasks.map((task) => <KanbanCard key={task.id} task={task} />)}
    </div>
  )
}

export default function TaskKanbanView() {
  const tasks = useTaskStore((s) => s.tasks)
  const updateStatus = useTaskStore((s) => s.updateStatus)
  const columns = columnsFromTasks(tasks)

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return
    updateStatus(active.id, over.id)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {Object.entries(columns).map(([status, columnTasks]) => (
        <KanbanColumn key={status} status={status} tasks={columnTasks} />
      ))}
    </DndContext>
  )
}
