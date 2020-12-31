import { AuthState } from '@aws-amplify/ui-components';
import {
  action,
  Action,
  computed,
  Computed,
  createContextStore,
  createTypedHooks,
} from 'easy-peasy';

interface UserStoreModel {
  user: any;
  authState: string;
  setUser: Action<UserStoreModel, any>;
  setAuthState: Action<UserStoreModel, any>;
  isAuthenticated: Computed<UserStoreModel, any>;
}

export const UserStore = createContextStore<UserStoreModel>({
  user: null,
  authState: AuthState.SignedOut,
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setAuthState: action((state, payload) => {
    state.authState = payload;
  }),
  isAuthenticated: computed(state => {
    return state.authState === AuthState.SignedIn && state.user;
  }),
});

const typedHooks = createTypedHooks<UserStoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
