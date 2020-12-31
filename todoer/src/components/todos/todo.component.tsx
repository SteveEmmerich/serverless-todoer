import React, { useState, useEffect } from 'react';

import {
  IonButton,
  IonItem,
  IonLabel,
  IonTextarea,
  IonThumbnail,
  IonSkeletonText,
  IonInput,
  IonCheckbox,
  IonText,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonIcon,
} from '@ionic/react';
import { trash } from 'ionicons/icons';

import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import { Todo, TodoStore } from 'src/state/todo.state';

interface TodoProps {
  id: string;
  todo?: Todo;
  setShowModal?: Function;
}
const TodoSkeleton = () => (
  <>
    <IonThumbnail slot="start">
      <IonSkeletonText animated />
    </IonThumbnail>
    <IonLabel>
      <h3>
        <IonSkeletonText animated style={{ width: '50%' }} />
      </h3>
      <p>
        <IonSkeletonText animated style={{ width: '80%' }} />
      </p>
      <p>
        <IonSkeletonText animated style={{ width: '60%' }} />
      </p>
    </IonLabel>
  </>
);
const TodoEditAble: React.FC<TodoProps | null> = props => {
  // const [todo, saveTodo] = useRecoilState(todoSelector(props?.todo?.id || ''));
  // console.log('edit todo: ', todo);
  const [updateAndSaveTodo, saveTodo] = TodoStore.useStoreActions(actions => [
    actions.updateAndSaveTodo,
    actions.saveTodo,
  ]);
  const todo: Todo = TodoStore.useStoreState(state =>
    state.getTodo(props?.id || ''),
  ) as Todo;
  const {
    register,
    control,
    handleSubmit,
    formState,
    reset,
    errors,
    setValue,
  } = useForm<Todo>({
    defaultValues: todo,
    mode: 'onBlur',
  });
  useEffect(() => {
    setValue('done', todo.done);
  }, [setValue, todo.done]);
  /*const todo = props.todo
    ? props.todo
    : { id: '', title: '', task: '', done: false };*/

  const onSubmit = async (data: Todo) => {
    const fullTodo = { ...todo, ...data };
    todo.id ? updateAndSaveTodo(fullTodo) : saveTodo(fullTodo);

    if (props.setShowModal) {
      props.setShowModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 18 }}>
      <IonItem>
        <IonLabel>Title</IonLabel>
        <Controller
          render={({ onChange, onBlur, value }) => (
            <IonInput onIonBlur={onBlur} onIonChange={onChange} value={value} />
          )}
          control={control}
          name="title"
          rules={{
            required: true,
            minLength: { value: 4, message: 'Must be 4 characters long' },
          }}
        />
      </IonItem>
      <ErrorMessage
        errors={errors}
        name="title"
        as={<div style={{ color: 'red' }} />}
      />
      <IonItem>
        <IonLabel>Task</IonLabel>
        {/*<IonTextarea value={todo.task} onIonChange={createChangeHandler("task")}></IonTextarea>*/}
        <Controller
          render={({ onChange, onBlur, value }) => (
            <IonTextarea
              onIonBlur={onBlur}
              onIonChange={onChange}
              value={value}
            />
          )}
          control={control}
          name="task"
          rules={{
            required: true,
            minLength: { value: 4, message: 'Must be 4 chars long' },
          }}
        />
      </IonItem>
      <ErrorMessage
        errors={errors}
        name="task"
        as={<div style={{ color: 'red' }} />}
      />
      {/*<IonItem>
        <IonLabel>Due Date</IonLabel>
        {
        <Controller
          render={({ onChange, onBlur, value }) => (
            <IonDatetime
              displayFormat="MM DD YY"
              placeholder="Select Due date"
              onIonBlur={onBlur}
              onIonChange={onChange}
            />
          )}
          control={control}
          name="due_date"
          rules={{
            required: false,
          }}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Alert You?</IonLabel>
        <Controller
          render={({ onChange, onBlur, value }) => (
            <IonCheckbox
              onIonBlur={onBlur}
              onIonChange={onChange}
              checked={value}
            />
          )}
          control={control}
          name="should_alert"
          rules={{
            required: false,
          }}
        />
     
      </IonItem>*/}
      <IonItem>
        <IonLabel>Done?</IonLabel>
        <Controller
          render={({ onChange, onBlur, value }) => (
            <IonCheckbox
              onIonBlur={onBlur}
              onIonChange={event => {
                console.log(event.detail.value, event.detail.checked);
                onChange(event.detail.checked);
              }}
              checked={value}
            />
          )}
          control={control}
          name="done"
          rules={{
            required: false,
          }}
        />
        {/*<IonCheckbox checked={todo.shouldAlert} onIonChange={createChangeHandler("shouldAlert")}></IonCheckbox>*/}
      </IonItem>
      <div>
        <IonButton
          type="button"
          onClick={() => {
            reset(todo);
          }}
        >
          Reset
        </IonButton>

        <IonButton disabled={formState.isValid === false} type="submit">
          submit
        </IonButton>
      </div>
    </form>
  );
};
const TodoItem: React.FC<TodoProps | null> = props => {
  const [showItem, setShowItem] = useState<boolean>(false);

  const [
    updateAndSaveTodo,
    deleteAndSaveTodo,
  ] = TodoStore.useStoreActions(actions => [
    actions.updateAndSaveTodo,
    actions.deleteAndSaveTodo,
  ]);
  const todo: Todo = TodoStore.useStoreState(state =>
    state.getTodo(props.id),
  ) as Todo;
  const loading = TodoStore.useStoreState(state => state.loading);

  return (
    <div>
      {props.id !== '' ? (
        <>
          <IonItemSliding>
            <IonItemOptions side="start">
              <IonItemOption
                onClick={() =>
                  updateAndSaveTodo({ ...todo, done: !todo?.done } as Todo)
                }
              >
                <IonCheckbox
                  checked={todo?.done}
                  color="tertiary"
                ></IonCheckbox>
              </IonItemOption>
              <IonItemOption
                color="danger"
                onClick={() => deleteAndSaveTodo(todo?.id as string)}
              >
                <IonIcon slot="icon-only" icon={trash} />
              </IonItemOption>
            </IonItemOptions>
            <IonItem
              color={'medium'}
              detail
              onClick={() => setShowItem(!showItem)}
            >
              <IonLabel>
                <IonText color="dark">
                  <h3>{todo?.title}</h3>
                </IonText>
              </IonLabel>
            </IonItem>
          </IonItemSliding>
          {showItem ? <TodoEditAble id={todo.id} todo={todo} /> : null}
        </>
      ) : (
        <TodoEditAble setShowModal={props.setShowModal} id={props.id} />
      )}
    </div>
  );
};

export default TodoItem;
