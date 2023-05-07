import * as React from "react";



import { type ToastActionElement, type ToastProps } from "@starter/ui";





const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

const generateId = () => {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}


type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      id: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      id: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (id: string) => {
  if (toastTimeouts.has(id)) {
    clearTimeout(toastTimeouts.get(id));
  }

  toastTimeouts.set(
    id,
    setTimeout(() => {
      toastTimeouts.delete(id);
      dispatch({ type: actionTypes.REMOVE_TOAST, id });
    }, TOAST_REMOVE_DELAY)
  );
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST: {
      const { toast } = action;
      const toasts = [...state.toasts, toast];
      if (toasts.length > TOAST_LIMIT) {
        toasts.shift();
      }
      return { ...state, toasts };
    }
    case actionTypes.UPDATE_TOAST: {
      const { toast } = action;
      const toasts = state.toasts.map((t) => (t.id === toast.id ? toast : t));
      return { ...state, toasts };
    }
    case actionTypes.DISMISS_TOAST: {
      const { id } = action;

      if (id) {
        addToRemoveQueue(id);
      } else {
        toastTimeouts.forEach((timeout, id) => {
          clearTimeout(timeout);
          addToRemoveQueue(id);
        });
      }
      const toasts = state.toasts.map((t) =>
        t.id === id ? { ...t, dismissed: true } : t
      );
      return { ...state, toasts };
    }
    case actionTypes.REMOVE_TOAST: {
      const { id } = action;
      const toasts = state.toasts.filter((t) => t.id !== id);
      return { ...state, toasts };
    }
    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

type Toast = Omit<ToasterToast, "id">

const toast = ({ ...props }: Toast) => {
  const id = generateId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", id: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
};

const useToast = () => {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners.splice(listeners.indexOf(setState), 1);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
  };
};

export { useToast, toast };
