import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ValidatorService } from "src/app/services/validator.service";
import { BookingRequest } from "src/app/models/bookingRequest";
import { ApiService } from "src/app/services/api.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { Observable } from "rxjs";
import * as SubmitActions from "../../store/submit/submit.actions";
import * as ReservedActions from "../../store/reserved/reserved.actions";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

  currentMonth = new Date();
  daysInTheMonth:Date[] = []

  selectedDays:Date[] = []

  calendarForm: FormGroup;

  totalPay = 0;
  message = '';

  reservedDates:string[] = []

  showMessageWindow: boolean = false;



  isSubmitting$: Observable<boolean> = this.store.select(state => state.submit.isSubmitting)
  submittingMessage$: Observable<string> = this.store.select(state => state.submit.message)
  submittingError$:Observable<string | null> = this.store.select(state => state.submit.error)

  isLoadingReserved$: Observable<boolean> = this.store.select(state => state.reserved.isLoadingReserved)
  reservedDates$: Observable<string[]> = this.store.select(state => state.reserved.reserved)
  reservedError$: Observable<string | null> = this.store.select(state => state.reserved.error)

  constructor(private formBuilder: FormBuilder, private validator: ValidatorService, private apiService: ApiService, private store: Store<AppState>){ 
    this.calendarForm = this.formBuilder.group({
      adults: [1],
      children: [0],
      nights: [0],
      phone: ['', Validators.required, [this.validator.isPhoneNumberValid]],
      mail: ['', Validators.required,[this.validator.isEmailValid]],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(ReservedActions.requestReserved())

    this.setDaysInTheMonth();

    this.calendarForm.valueChanges.subscribe(value => {
      this.totalPay = ((value.adults * 50 ) + (value.children * 30)) * value.nights
    })
  }

  selectDay(day:Date) {
    if(this.isSelected(day)) { this.checkToRemove(day)}
    else { this.checkToAdd(day) }
    this.calendarForm.patchValue({nights: this.getNumberOfNights()})
  }

  checkToRemove(day:Date) {
    if(this.selectedDays.length === 1) { this.selectedDays = [] }
    else if ( this.isSameDate(this.getFirstSelectedDay(),day) ) { this.selectedDays.shift() }
    else if ( this.isSameDate(this.getLastSelectedDay(),day) ) { this.selectedDays.pop() }
  }

  checkToAdd(day:Date) {
    if(this.selectedDays.length === 0) { this.selectedDays.push(day) } 

    else {

      // next
      if(day.getMonth() === this.getLastSelectedDay().getMonth() && day.getDate() === this.getLastSelectedDay().getDate() + 1) { this.selectedDays.push(day) }
      else if(
        this.isSameDate(this.getLastSelectedDay(),this.getLastDayOfPrevMonth()) &&
        this.isSameDate(day, this.getFirstDayOfMonth())
        ) { this.selectedDays.push(day) }
      else if(
        this.isSameDate(this.getLastSelectedDay(),this.getLastDayOfMonth()) &&
        this.isSameDate(day, this.getFirstDayOfNextMonth())
      ) { this.selectedDays.push(day) }
      
      // prev
      if(day.getMonth() === this.getFirstSelectedDay().getMonth() && day.getDate() === this.getFirstSelectedDay().getDate() - 1) { this.selectedDays.unshift(day) }
      else if(
        this.isSameDate(this.getFirstSelectedDay(),this.getFirstDayOfNextMonth()) &&
        this.isSameDate(day, this.getLastDayOfMonth())
        ) { this.selectedDays.unshift(day) }
      else if(
          this.isSameDate(this.getFirstSelectedDay(),this.getFirstDayOfMonth()) &&
          this.isSameDate(day, this.getLastDayOfPrevMonth())
      ) { this.selectedDays.unshift(day) }

    }
  }



  isSelected(day:Date):boolean {
    let selected = false
    this.selectedDays.forEach(selectedDay => {
      if(this.isSameDate(selectedDay, day)) { selected = true }

    })
    return selected
  }

  setDaysInTheMonth() {
    this.daysInTheMonth = [...this.getDaysFromMonday(),...this.getDaysInMonth(),...this.getDaysTillSunday()]
  }

  getFirstSelectedDay() {
    return this.selectedDays[0]
  }
  getLastSelectedDay() {
    return this.selectedDays[this.selectedDays.length-1]
  }
  getFirstDayOfMonth() {
    return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
  }
  getLastDayOfMonth() {
    return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
  }
  getFirstDayOfNextMonth() {
    return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth()+1, 1);
  }
  getLastDayOfPrevMonth() {
    return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 0);
  }

  isSameDate(date1:Date, date2:Date) {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
  }
  isReserved(date:Date) {
    let reserved = false
      this.reservedDates$.subscribe(reservedDate => {
        reservedDate.forEach(dateString => {
          if(this.isSameDate(date, new Date(dateString))) { reserved = true }
        })
      })
    return reserved
  }

  getDaysFromMonday():Date[] {
    let days:Date[] = []
    let firstDay = this.getFirstDayOfMonth().getDay() == 0 ? 7 : this.getFirstDayOfMonth().getDay() 
    for(let i = 0; i > - firstDay+1; i--) {
      days.push( new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i) )
    }
    return days.reverse();
  }
  getDaysTillSunday():Date[] {
    let days:Date[] = []
    let lastDay = this.getLastDayOfMonth().getDay() == 0 ? 7 : this.getLastDayOfMonth().getDay()
    for(let i = 1; i < 8-lastDay; i++) {
      days.push( new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), this.getLastDayOfMonth().getDate()+i) )
    }
    return days;
  }
  getDaysInMonth():Date[] {
    let days:Date[] = [];
    for (let i = 1; i <= this.getLastDayOfMonth().getDate(); i++) {
      days.push( new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i) );
    }
    return days;
  }

  getNumberOfNights() {
    if(this.selectedDays.length === 0) { return 0 }
    return this.selectedDays.length-1
  }

  isBeforeToday(day:Date) {
    return day < new Date()
  }

  validSelection() {
  return this.calendarForm.valid && (this.selectedDays.length >= 2)
  }

  // buttons
  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth()+1, 1);
    this.setDaysInTheMonth()
  }
  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth()-1, 1);
    this.setDaysInTheMonth()
  }

  formButton() {
    let bookingRequest: BookingRequest = {
      adults: +this.calendarForm.value.adults,
      children: +this.calendarForm.value.children,
      email: this.calendarForm.value.mail,
      phone: this.calendarForm.value.phone,
      checkIn: this.getFirstSelectedDay().toDateString(),
      checkOut: this.getLastSelectedDay().toDateString(),
    }
    console.log(bookingRequest)
    this.showMessageWindow = true
    this.store.dispatch(SubmitActions.requestSubmit(bookingRequest))
    this.submittingMessage$.subscribe(message => {
      if(message === 'Booking request sent') {
        this.clearSelection(),
        this.resetDate()
      }
    })
  }

  clearSelection() {
    this.selectedDays = []
    this.calendarForm.patchValue({
      adults: 1,
      children: 0,
      mail: '',
      phone: '',
    })
    this.totalPay = 0
  }

  resetDate(){
    this.currentMonth = new Date()
    this.setDaysInTheMonth()
  }

  closeMessageWindow() {
    this.isSubmitting$.subscribe(isSubmitting => {
      if(!isSubmitting) {
        this.showMessageWindow = false
      }
    }).unsubscribe()
  }

} 
