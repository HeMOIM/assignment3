import type { Status, Task } from './taskReducer'

export type Filter = 'all' | Status

export const FILTERS: Filter[] = ['all', 'todo', 'in-progress', 'done']

export const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

export type Counts = Record<Filter, number>

/** Returns the tasks that match the filter. 'all' returns every task. */
export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  return tasks.filter((t) => filter === 'all' || t.status === filter)
}

/** Returns how many tasks each filter button would show. */
export function countByFilter(tasks: Task[]): Counts {
  const counts: Counts = { all: tasks.length, todo: 0, 'in-progress': 0, done: 0 }
  for (const t of tasks) {
    counts[t.status] += 1
  }
  return counts
}
