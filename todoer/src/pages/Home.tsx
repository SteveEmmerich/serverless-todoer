import { AmplifySignOut } from '@aws-amplify/ui-react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

import { UserStore } from 'src/state/user.state';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  const user = UserStore.useStoreState(state => state.user);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todoer</IonTitle>

          <IonButtons slot="end">
            <IonText>Hello {user.username}</IonText>
            <AmplifySignOut />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Todoer</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
