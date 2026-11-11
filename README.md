# Task Manager with a Reducer

Name: Ebraheem Abokhalil
Student number: 2300001553

A small Task Manager built with React, TypeScript and `useReducer`. State is `{ tasks, filter, past }`. The filtered list and the counts are derived while rendering.

Run it:

```
npm install
npm run dev
npm run build
npm test
```

## Bonus 1: Undo

The state is `{ tasks: Task[]; filter: Filter; past: Task[][] }`. `past` is a stack of earlier task lists, oldest first. Every action that really changes the tasks (add, advance, remove, clearDone) pushes the old list onto `past`, and the `undo` action pops the last list back into `tasks`. Changing the filter does not touch `past`, `undo` with an empty `past` does nothing, and the Undo button is disabled when `past` is empty.

## Bonus 2: Tests

Tests are in `src/taskReducer.test.ts` and `src/filter.test.ts` and run with Vitest.

Output of `npm test`:

```
PASTE YOUR REAL OUTPUT HERE
```

## Bonus 3: Explain your reducer

A reducer must be pure because React decides whether to re-render by comparing the old state with the new state by identity. If the reducer pushes into the old array or changes a field of the old object, the "new" state is the same object as the old one, so React sees no change and the screen does not update. It also makes the reducer unpredictable and hard to test, because the same input would no longer always give the same output.

The caller creates the id with crypto.randomUUID() and passes it in the action. A random call inside the reducer would give a different result every time for the same state and action, which breaks purity. React can also run a reducer twice in development to catch impure code, and two runs would create two different ids.

The filtered list and the counts are derived while rendering from state.tasks and state.filter. If I stored them in state, I would have two copies of the same information. For example, with the Done filter on, advancing a task to done would update the tasks but leave a stored filtered list unchanged, so the task would not appear until I clicked the filter again. Deriving them makes this bug impossible.

Moving the filter into the reducer state made some things easier: there is one state object and one dispatch function to pass around, and clearDone and undo keep the filter without extra code. I also decided in one place that setFilter does not touch the undo history. The cost is that even a simple choice like the filter now needs an action type and a case in the switch.

## Bonus 4: Git repository

PASTE YOUR REPOSITORY LINK HERE
