'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  use,
  useActionState,
  useEffect,
  useOptimistic,
  useReducer,
} from 'react';
import { createChat } from '../../actions';
import { useRouter } from 'next/navigation';

type State =
  | {
      status: 'idle';
      effect?: () => Action;
    }
  | {
      status: 'will-create-chat';
      id: string;
      message: string;
      effect?: () => Action;
    };

type Action =
  | {
      type: 'createChat';
      id: string;
      message: string;
    }
  | { type: 'reset' };

const initialState: State = { status: 'idle' };

const Context = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

export function Provider({ children }: { children: ReactNode }) {
  // const router = useRouter();
  const [currentState, dispatch] = useActionState(
    async (state: State, action: Action): Promise<State> => {
      switch (action.type) {
        case 'createChat':
          console.log('?');
          // setOptimisticState({
          //   status: 'will-create-chat',
          //   id: action.id,
          //   message: action.message,
          // });
          await createChat(action.id, action.message);
          // router.push(`/chat/${action.id}`);

          return { status: 'idle' };
        default:
          return state;
      }
    },
    initialState
  );
  const [optimisticState, setOptimisticState] = useOptimistic(currentState);

  console.log(optimisticState);

  // provider.dispatch({ type: 'createChat', id: newId, message });
  // const currentState = initialState;
  // async function dispatch(action: Action) {
  //   if (action.type === 'createChat') {
  //     await createChat(action.id, action.message);
  //   }
  // }

  // console.log('rendering provider');

  // const [optimisticState, setOptimisticState] = useOptimistic(currentState);

  // console.log(currentState);
  // console.log(optimisticState);

  // const [currentState, dispatch] = useReducer(
  //   (state: State, action: Action): State => {
  //     // console.log(state, action);
  //     switch (action.type) {
  //       case 'createChat':
  //         return {
  //           ...state,
  //           status: 'will-create-chat',
  //           id: action.id,
  //           message: action.message,
  //           effect() {
  //             createChat(action.id, action.message);
  //             return { type: 'reset' };
  //           },
  //         };
  //         return state;

  //       case 'reset':
  //         return { status: 'idle' };

  //       default:
  //         return state;
  //     }
  //   },
  //   initialState
  // );
  // console.log(currentState);

  // useEffect(() => {
  //   if (currentState.effect) {
  //     const effect = currentState.effect;
  //     const nextAction = effect();
  //     dispatch(nextAction);
  //   }
  // }, [currentState]);

  return (
    <Context.Provider value={{ state: currentState, dispatch }}>
      {children}
    </Context.Provider>
  );
}

export function useProvider() {
  return use(Context);
}
