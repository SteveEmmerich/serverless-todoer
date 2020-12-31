import React, { Suspense, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Amplify, { Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { AuthState } from '@aws-amplify/ui-components';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { UserStore } from './state/user.state';
import { TodoStore } from './state/todo.state';

Amplify.configure(awsmobile);

/** Wrapper for the react router routes
 * Allows the state and user auth to be a move managable component
 */
const RouteWrapper: React.FC = () => {
  const isUserAuthenticated = UserStore.useStoreState(
    state => state.isAuthenticated,
  );

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route
          path="/home"
          render={() => {
            return isUserAuthenticated ? <Home /> : <Redirect to="/" />;
          }}
          exact={true}
        />
        <Route
          exact
          path="/"
          render={() => {
            return isUserAuthenticated ? <Redirect to="/home" /> : null;
          }}
        />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};
/**
 * Error fall back component
 * Should be moved to utils or common
 *
 */
const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div style={{ color: 'white' }} role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

/**
 * Wrapper for the ionApp component
 * Sets up the authentication listeners from amplify
 */
const InnerApp: React.FC = () => {
  //const [stateOfUser, setUserState] = useRecoilState(UserAtom);
  //const isUserAuthenticated = useRecoilValue(isAuthenticated);
  const [setUser, setAuthState] = UserStore.useStoreActions(actions => [
    actions.setUser,
    actions.setAuthState,
  ]);
  useEffect(() => {
    (async () => {
      const currentUser = await Auth.currentAuthenticatedUser();
      const authState = currentUser ? AuthState.SignedIn : AuthState.SignedOut;

      setUser(currentUser.attributes);
      setAuthState(authState);
    })();
  }, []);
  return (
    <IonApp>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<IonSpinner />}>
          <RouteWrapper />
        </Suspense>
      </ErrorBoundary>
    </IonApp>
  );
};

/** Main app component */
const App: React.FC = () => {
  return (
    <UserStore.Provider>
      <TodoStore.Provider>
        <InnerApp />
      </TodoStore.Provider>
    </UserStore.Provider>
  );
};

export default withAuthenticator(App, { usernameAlias: 'email' });
