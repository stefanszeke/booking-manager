import { createReducer, on } from "@ngrx/store";
import * as SubmitActions from "./submit.actions";

export interface SubmitState {
  isSubmitting: boolean;
  message: string;
  error: string | null;
}

export const initialState: SubmitState = {
  isSubmitting: false,
  message: "",
  error: null,
};

export const submitReducer = createReducer(
  initialState,
  on(SubmitActions.requestSubmit, (state) => ({
    ...state,
    isSubmitting: true,
  })),
  on(SubmitActions.requestSubmitSuccess, (state, {message}) => ({
    ...state,
    message: message,
    isSubmitting: false,
  })),
  on(SubmitActions.requestSubmitFailure, (state, { error }) => ({
    ...state,
    isSubmitting: false,
    error: error,
  }))
);