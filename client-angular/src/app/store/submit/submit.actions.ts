import { createAction, props } from "@ngrx/store";
import { BookingRequest } from "src/app/models/bookingRequest";

export const requestSubmit = createAction(
  "[Submit] Request Submit",
  (payload: BookingRequest) => ({ payload })
);

export const requestSubmitSuccess = createAction(
  "[Submit] Request Submit Success",
  props<{ message: string }>(),
);

export const requestSubmitFailure = createAction(
  "[Submit] Request Submit Failure",
  props<{ error: string }>(),
);