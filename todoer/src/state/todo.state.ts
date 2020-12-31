import { API } from 'aws-amplify';
import {
  Action,
  action,
  createContextStore,
  Thunk,
  Computed,
  computed,
  thunk,
  createTypedHooks,
} from 'easy-peasy';

import { removeItemAtIndex } from './utils';

export interface Todo {
  id: string;
  title: string;
  task: string;
  dueDate?: string;
  shouldAlert: boolean;
  img?: string;
  done: boolean;
}

interface TodoStoreModel {
  todos: Todo[];
  getTodo: Computed<TodoStoreModel, (id: string) => Todo | undefined, Todo>;
  loading: boolean;
  error?: string;
  addTodo: Action<TodoStoreModel, Todo>;
  setTodos: Action<TodoStoreModel, Todo[]>;
  saveTodo: Thunk<TodoStoreModel, Todo>;
  completedTodos: Computed<TodoStoreModel, Todo[]>;
  updateTodo: Action<TodoStoreModel, Todo>;
  updateAndSaveTodo: Thunk<TodoStoreModel, Todo>;
  deleteTodo: Action<TodoStoreModel, string>;
  deleteAndSaveTodo: Thunk<TodoStoreModel, string>;

  fetchOne: Thunk<TodoStoreModel, string>;
  getOne: Action<TodoStoreModel, Todo>;
  fetchAll: Thunk<TodoStoreModel>;
  setLoading: Action<TodoStoreModel, boolean>;
  setError: Action<TodoStoreModel, string | undefined>;
}

export const TodoStore = createContextStore<TodoStoreModel>({
  todos: [],
  loading: false,
  getTodo: computed(state => id => {
    const todo = state.todos.find(items => items.id === id);
    return todo ? todo : ({ id: '', title: '', task: '', done: false } as Todo);
  }),
  completedTodos: computed(state => state.todos.filter(todo => todo.done)),
  addTodo: action((state, payload) => {
    state.todos.push(payload);
  }),
  setTodos: action((state, payload) => {
    state.todos = payload;
  }),

  saveTodo: thunk(async (actions, payload) => {
    const response = await API.post('SharedGW', '/todos', {
      body: payload,
    });
    actions.addTodo(response);
  }),
  updateTodo: action((state, payload) => {
    const idx = state.todos.findIndex(item => item.id === payload.id);

    state.todos[idx] = { ...state.todos[idx], ...payload };
  }),
  updateAndSaveTodo: thunk<TodoStoreModel, Todo>(async (actions, payload) => {
    try {
      actions.setLoading(true);
      const response = await API.put('SharedGW', `/todos/${payload.id}`, {
        body: payload,
      });

      actions.updateTodo(response);
    } catch (e) {
      console.log('error', e);
      actions.setError(e);
    }
    actions.setLoading(false);
  }),
  deleteTodo: action((state, payload) => {
    state.todos = removeItemAtIndex(
      state.todos,
      state.todos.findIndex(item => item.id === payload),
    );
    // Delete the todo
  }),
  deleteAndSaveTodo: thunk(async (actions, payload) => {
    actions.setLoading(true);
    await API.del('SharedGW', `/todos/${payload}`, {
      pathParameters: {
        id: payload,
      },
    });
    actions.setLoading(false);
    actions.deleteTodo(payload);
  }),
  fetchOne: thunk(async (actions, payload) => {
    const response = await API.get('SharedGW', `/todos/${payload}`, {});
    actions.getOne(response);
  }),
  fetchAll: thunk(async actions => {
    actions.setLoading(true);
    try {
      const response = await API.get('SharedGW', '/todos', {});
      actions.setTodos(response);
    } catch (e) {
      console.log('error: ', e);
      actions.setError(e);
    }
    actions.setLoading(false);
  }),
  getOne: action((state, payload) => {
    // later
  }),
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  setError: action((state, payload) => {
    state.error = payload;
  }),
});

const typedHooks = createTypedHooks<TodoStoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
