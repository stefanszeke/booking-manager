import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { BookingRequest } from "src/app/models/bookingRequest";

import { ApiService } from "src/app/services/api.service";

import * as SubmitActions from "./submit.actions";


@Injectable()
export class SubmitEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}

  makeBookingRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubmitActions.requestSubmit), // action1
      delay(1000),

      mergeMap(
        (action) =>

          this.apiService
            .sendBookingRequest(action.payload)
            .pipe(map((payload) => SubmitActions.requestSubmitSuccess( payload ))) // action2
      ),

      catchError(
        (err) => of(SubmitActions.requestSubmitFailure({ error: 'something wrong' })) // action3
      )
    )
  );

  
}

