import { useReducer, type Dispatch, type FormEvent } from 'react'
import './App.css'
import {
  countByFilter,
  filterTasks,
  FILTER_LABELS,
  FILTERS,
  type Counts,
  type Filter,
} from './filter'
import { TaskRow } from './TaskRow'
import {
  initialState,
  taskReducer,
  type Action,
  type Task,
} from './taskReducer'

function AddForm({ dispatch }: { dispatch: Dispatch<Action> }) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const title = String(new FormData(form).get('title') ?? '').trim()
    if (title) {
      // The id is made here, not in the reducer, so the reducer stays pure.
      dispatch({ type: 'add', id: crypto.randomUUID(), title })
      form.reset()
    }
  }
  return (
    <form onSubmit={onSubmit} className="add-form">
      <input name="title" placeholder="New task" />
      <button type="submit">Add</button>
    </form>
  )
}

type FilterBarProps = {
  filter: Filter
  counts: Counts
  dispatch: Dispatch<Action>
}

function FilterBar({ filter, counts, dispatch }: FilterBarProps) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          className={f === filter ? 'active' : ''}
          aria-pressed={f === filter}
          onClick={() => dispatch({ type: 'setFilter', filter: f })}
        >
          {FILTER_LABELS[f]} ({counts[f]})
        </button>
      ))}
    </div>
  )
}

type TaskListProps = {
  tasks: Task[]
  dispatch: Dispatch<Action>
}

function TaskList({ tasks, dispatch }: TaskListProps) {
  if (tasks.length === 0) return <p className="empty">No tasks here.</p>
  return (
    <ul className="task-list">
      {tasks.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          onAdvance={(id) => dispatch({ type: 'advance', id })}
          onRemove={(id) => dispatch({ type: 'remove', id })}
        />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  // Derived while rendering. Never stored in state.
  const visible = filterTasks(state.tasks, state.filter)
  const counts = countByFilter(state.tasks)

  return (
    <main className="app">
      <h1>Task Manager</h1>
      <AddForm dispatch={dispatch} />
      <FilterBar filter={state.filter} counts={counts} dispatch={dispatch} />
      <div className="actions">
        <button type="button" onClick={() => dispatch({ type: 'clearDone' })}>
          Clear done
        </button>
        <button
          type="button"
          disabled={state.past.length === 0}
          onClick={() => dispatch({ type: 'undo' })}
        >
          Undo
        </button>
      </div>
      <TaskList tasks={visible} dispatch={dispatch} />
    </main>
  )
}
