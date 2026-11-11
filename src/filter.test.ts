import { describe, expect, it } from 'vitest'
import { countByFilter, filterTasks } from './filter'
import { initialState, taskReducer, type Task } from './taskReducer'

const tasks: Task[] = [
  { id: '1', title: 'A', status: 'todo' },
  { id: '2', title: 'B', status: 'in-progress' },
  { id: '3', title: 'C', status: 'done' },
  { id: '4', title: 'D', status: 'todo' },
]

describe('filterTasks', () => {
  it('all returns every task in order', () => {
    expect(filterTasks(tasks, 'all')).toEqual(tasks)
  })

  it('returns only tasks with the chosen status', () => {
    expect(filterTasks(tasks, 'todo').map((t) => t.id)).toEqual(['1', '4'])
    expect(filterTasks(tasks, 'in-progress').map((t) => t.id)).toEqual(['2'])
    expect(filterTasks(tasks, 'done').map((t) => t.id)).toEqual(['3'])
  })

  it('works on an empty list', () => {
    expect(filterTasks([], 'done')).toEqual([])
  })

  it('does not change the input list', () => {
    const copy = structuredClone(tasks)
    filterTasks(tasks, 'todo')
    expect(tasks).toEqual(copy)
  })
})

describe('countByFilter', () => {
  it('counts every status and the total', () => {
    expect(countByFilter(tasks)).toEqual({ all: 4, todo: 2, 'in-progress': 1, done: 1 })
  })

  it('gives zeros for an empty list', () => {
    expect(countByFilter([])).toEqual({ all: 0, todo: 0, 'in-progress': 0, done: 0 })
  })

  it('is correct after a delete', () => {
    const s = taskReducer({ ...initialState, tasks }, { type: 'remove', id: '1' })
    expect(countByFilter(s.tasks)).toEqual({ all: 3, todo: 1, 'in-progress': 1, done: 1 })
  })
})
