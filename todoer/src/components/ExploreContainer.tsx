import React, { useState } from 'react';
import './ExploreContainer.css';

import { IonButton, IonModal } from '@ionic/react';
import TodoList from './todos/todo-list.component';
import TodoItem from './todos/todo.component';
interface ContainerProps {}

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <IonButton onClick={() => setShowModal(true)}>New Todo?</IonButton>
      <IonModal isOpen={showModal}>
        <TodoItem setShowModal={(val: boolean) => setShowModal(val)} id={''} />
        <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
      </IonModal>
      <TodoList />
    </div>
  );
};

export default ExploreContainer;
