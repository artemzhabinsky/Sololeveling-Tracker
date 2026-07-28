import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { useTaskStore } from '../../state/useTaskStore.js'
import { columnsFromTasks } from '../../domain/kanban.js'

const COLUMN_LABELS = { todo: 'В очереди', in_progress: 'В работе', done: 'Готово' }
const COLUMN_TONE = {
  todo: 'border-t-edge-lit',
  in_progress: 'border-t-gold',
  done: 'border-t-jade',
}

function KanbanCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab border border-edge bg-raised px-3 py-2.5 text-sm text-bone
                 transition-colors hover:border-jade active:cursor-grabbing"
    >
      {task.title}
    </div>
  )
}

function KanbanColumn({ status, tasks }) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      data-testid={`kanban-column-${status}`}
      className={`flex min-h-40 min-w-56 flex-1 flex-col gap-2 border-t-2 bg-hollow/60 p-3 ${COLUMN_TONE[status]}`}
    >
      <h3>
        {COLUMN_LABELS[status]} · {tasks.length}
      </h3>
      {tasks.map((task) => (
        <KanbanCard key={task.id} task={task} />
      ))}
    </div>
  )
}

export default function TaskKanbanView() {
  const tasks = useTaskStore((s) => s.tasks)
  const updateStatus = useTaskStore((s) => s.updateStatus)
  const completeTask = useTaskStore((s) => s.completeTask)
  const columns = columnsFromTasks(tasks)

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return

    // Dropping into "Готово" has to be a real completion, not a status flip:
    // the list view hides the "Выполнить" button once a task is done, so an
    // unrewarded card dragged here would strand its XP/coins permanently.
    const task = tasks.find((t) => t.id === active.id)
    if (over.id === 'done' && task?.status !== 'done') {
      completeTask(active.id)
      return
    }

    updateStatus(active.id, over.id)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto">
        {Object.entries(columns).map(([status, columnTasks]) => (
          <KanbanColumn key={status} status={status} tasks={columnTasks} />
        ))}
      </div>
    </DndContext>
  )
}
