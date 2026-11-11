// Name: Ebraheem Abokhalil
// Student number: 2300001553

import type { Filter } from './filter'

export type Status = 'todo' | 'in-progress' | 'done'
export type Task = { id: string; title: string; status: Status }

// `past` is for Bonus 1 (Undo): earlier task lists, oldest first.
export type State = { tasks: Task[]; filter: Filter; past: Task[][] }

export type Action =
  | { type: 'add'; id: string; title: string }
  | { type: 'advance'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'setFilter'; filter: Filter }
  | { type: 'clearDone' }
  | { type: 'undo' }

export const initialState: State = { tasks: [], filter: 'all', past: [] }

const NEXT: Record<Status, Status> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
}

// Replace the task list and remember the old one so Undo can bring it back.
function withTasks(state: State, tasks: Task[]): State {
  return { ...state, tasks, past: [...state.past, state.tasks] }
}

export function taskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return withTasks(state, [
        ...state.tasks,
        { id: action.id, title: action.title, status: 'todo' },
      ])
    case 'advance': {
      if (!state.tasks.some((t) => t.id === action.id)) return state
      return withTasks(
        state,
        state.tasks.map((t) =>
          t.id === action.id ? { ...t, status: NEXT[t.status] } : t,
        ),
      )
    }
    case 'remove': {
      if (!state.tasks.some((t) => t.id === action.id)) return state
      return withTasks(
        state,
        state.tasks.filter((t) => t.id !== action.id),
      )
    }
    case 'setFilter':
      // Changing the filter is not undoable, so `past` stays as it is.
      return { ...state, filter: action.filter }
    case 'clearDone': {
      if (!state.tasks.some((t) => t.status === 'done')) return state
      return withTasks(
        state,
        state.tasks.filter((t) => t.status !== 'done'),
      )
    }
    case 'undo': {
      const previous = state.past[state.past.length - 1]
      if (previous === undefined) return state
      return { ...state, tasks: previous, past: state.past.slice(0, -1) }
    }
    default: {
      // If a new action type is added and not handled above, this line
      // stops compiling.
      const unhandled: never = action
      return unhandled
    }
  }
}
