import { ReservedState } from "./reserved/reserved.reducers";
import { SubmitState } from "./submit/submit.reducers";

export interface AppState {
  submit: SubmitState;
  reserved: ReservedState;
}