import type { Task } from './taskReducer'

type Props = {
  task: Task
  onAdvance: (id: string) => void
  onRemove: (id: string) => void
}

const LABEL: Record<Task['status'], string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

export function TaskRow({ task, onAdvance, onRemove }: Props) {
  return (
    <li className={`row ${task.status}`}>
      <span className="title">{task.title}</span>
      <span className="status">{LABEL[task.status]}</span>
      <button type="button" onClick={() => onAdvance(task.id)}>
        Next
      </button>
      <button type="button" onClick={() => onRemove(task.id)}>
        Delete
      </button>
    </li>
  )
}
