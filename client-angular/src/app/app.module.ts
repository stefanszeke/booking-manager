import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { CalendarComponent } from './components/calendar/calendar.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { submitReducer } from "./store/submit/submit.reducers";
import { SubmitEffects } from "./store/submit/submit.effects";
import { reservedReducer } from "./store/reserved/reserved.reducers";
import { ReservedEffects } from "./store/reserved/reserved.effects";

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    EffectsModule.forRoot([SubmitEffects, ReservedEffects]),
    StoreModule.forRoot({submit: submitReducer, reserved: reservedReducer}, {})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
