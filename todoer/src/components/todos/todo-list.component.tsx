import React, { useEffect } from 'react';

import { IonList, IonSpinner } from '@ionic/react';
import TodoItem from './todo.component';

import { TodoStore } from 'src/state/todo.state';

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const getTodos = TodoStore.useStoreActions(actions => actions.fetchAll);
  const todos = TodoStore.useStoreState(state => state.todos);
  const loading = TodoStore.useStoreState(state => state.loading);
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <>
      {loading ? <IonSpinner /> : null}
      {todos ? (
        <IonList>
          {todos.map(todo => (
            <TodoItem todo={todo} id={todo.id} key={todo.id} />
          ))}
        </IonList>
      ) : (
        <IonSpinner />
      )}
    </>
  );
};

export default TodoList;
