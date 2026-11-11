import { describe, expect, it } from 'vitest'
import {
  initialState,
  taskReducer,
  type State,
  type Task,
} from './taskReducer'

const t = (id: string, status: Task['status'] = 'todo'): Task => ({
  id,
  title: `Task ${id}`,
  status,
})

function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    Object.values(value).forEach(deepFreeze)
    Object.freeze(value)
  }
  return value
}

const stateWith = (tasks: Task[]): State => ({ ...initialState, tasks })

describe('taskReducer', () => {
  it('starts with no tasks, filter all and no history', () => {
    expect(initialState).toEqual({ tasks: [], filter: 'all', past: [] })
  })

  it('add appends a task with status todo', () => {
    const next = taskReducer(initialState, { type: 'add', id: 'a', title: 'Buy milk' })
    expect(next.tasks).toEqual([{ id: 'a', title: 'Buy milk', status: 'todo' }])
  })

  it('advance moves todo -> in-progress -> done -> todo', () => {
    let s = stateWith([t('a')])
    s = taskReducer(s, { type: 'advance', id: 'a' })
    expect(s.tasks[0]?.status).toBe('in-progress')
    s = taskReducer(s, { type: 'advance', id: 'a' })
    expect(s.tasks[0]?.status).toBe('done')
    s = taskReducer(s, { type: 'advance', id: 'a' })
    expect(s.tasks[0]?.status).toBe('todo')
  })

  it('remove deletes only that task', () => {
    const s = taskReducer(stateWith([t('a'), t('b')]), { type: 'remove', id: 'a' })
    expect(s.tasks.map((x) => x.id)).toEqual(['b'])
  })

  it('setFilter stores the filter and leaves the tasks alone', () => {
    const before = stateWith([t('a')])
    const s = taskReducer(before, { type: 'setFilter', filter: 'done' })
    expect(s.filter).toBe('done')
    expect(s.tasks).toBe(before.tasks)
  })

  it('clearDone removes done tasks and keeps the filter', () => {
    const before: State = {
      ...stateWith([t('a', 'done'), t('b'), t('c', 'done')]),
      filter: 'todo',
    }
    const s = taskReducer(before, { type: 'clearDone' })
    expect(s.tasks.map((x) => x.id)).toEqual(['b'])
    expect(s.filter).toBe('todo')
  })

  it('does not change the old state (deep frozen)', () => {
    const frozen = deepFreeze<State>({
      tasks: [t('a'), t('b', 'done')],
      filter: 'all',
      past: [],
    })
    const copy = JSON.parse(JSON.stringify(frozen)) as State
    taskReducer(frozen, { type: 'add', id: 'c', title: 'x' })
    taskReducer(frozen, { type: 'advance', id: 'a' })
    taskReducer(frozen, { type: 'remove', id: 'a' })
    taskReducer(frozen, { type: 'setFilter', filter: 'done' })
    taskReducer(frozen, { type: 'clearDone' })
    expect(frozen).toEqual(copy)
  })

  it('returns new objects and arrays for changes', () => {
    const before = stateWith([t('a')])
    const s = taskReducer(before, { type: 'advance', id: 'a' })
    expect(s).not.toBe(before)
    expect(s.tasks).not.toBe(before.tasks)
    expect(s.tasks[0]).not.toBe(before.tasks[0])
  })

  describe('edge cases', () => {
    it('advance with an unknown id changes nothing', () => {
      const before = stateWith([t('a')])
      expect(taskReducer(before, { type: 'advance', id: 'zzz' })).toBe(before)
    })

    it('remove with an unknown id changes nothing', () => {
      const before = stateWith([t('a')])
      expect(taskReducer(before, { type: 'remove', id: 'zzz' })).toBe(before)
    })

    it('actions on an empty list do not crash', () => {
      expect(taskReducer(initialState, { type: 'advance', id: 'a' }).tasks).toEqual([])
      expect(taskReducer(initialState, { type: 'clearDone' }).tasks).toEqual([])
    })

    it('clearDone with nothing done changes nothing', () => {
      const before = stateWith([t('a'), t('b', 'in-progress')])
      expect(taskReducer(before, { type: 'clearDone' })).toBe(before)
    })
  })

  describe('undo (Bonus 1)', () => {
    it('does nothing when there is nothing to undo', () => {
      expect(taskReducer(initialState, { type: 'undo' })).toBe(initialState)
    })

    it('brings back the list before the last change', () => {
      let s = taskReducer(initialState, { type: 'add', id: 'a', title: 'A' })
      s = taskReducer(s, { type: 'advance', id: 'a' })
      s = taskReducer(s, { type: 'undo' })
      expect(s.tasks[0]?.status).toBe('todo')
      s = taskReducer(s, { type: 'undo' })
      expect(s.tasks).toEqual([])
      expect(s.past).toEqual([])
    })

    it('brings back tasks removed by clearDone', () => {
      let s = stateWith([t('a', 'done'), t('b')])
      s = taskReducer(s, { type: 'clearDone' })
      expect(s.tasks).toHaveLength(1)
      s = taskReducer(s, { type: 'undo' })
      expect(s.tasks.map((x) => x.id)).toEqual(['a', 'b'])
    })

    it('does not record filter changes in the history', () => {
      const s = taskReducer(initialState, { type: 'setFilter', filter: 'done' })
      expect(s.past).toEqual([])
    })
  })
})
