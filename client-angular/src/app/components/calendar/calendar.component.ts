import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

  today = new Date();
  daysInTheMonth:Date[] = []

  selectedDays:Date[] = []

  testnumber = 10

  constructor() { }

  ngOnInit(): void {
    this.setDaysInTheMonth();
  }

  selectDay(day:Date) {
    if(this.isSelected(day)) { this.checkToRemove(day)}
    else { this.checkToAdd(day) }
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
    return new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  }
  getLastDayOfMonth() {
    return new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
  }
  getFirstDayOfNextMonth() {
    return new Date(this.today.getFullYear(), this.today.getMonth()+1, 1);
  }
  getLastDayOfPrevMonth() {
    return new Date(this.today.getFullYear(), this.today.getMonth(), 0);
  }
  isSameDate(date1:Date, date2:Date) {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
  }

  getDaysFromMonday():Date[] {
    let days:Date[] = []
    let firstDay = this.getFirstDayOfMonth().getDay() == 0 ? 7 : this.getFirstDayOfMonth().getDay() 
    for(let i = 0; i > - firstDay+1; i--) {
      days.push( new Date(this.today.getFullYear(), this.today.getMonth(), i) )
    }
    return days.reverse();
  }
  getDaysTillSunday():Date[] {
    let days:Date[] = []
    let lastDay = this.getLastDayOfMonth().getDay() == 0 ? 7 : this.getLastDayOfMonth().getDay()
    for(let i = 1; i < 8-lastDay; i++) {
      days.push( new Date(this.today.getFullYear(), this.today.getMonth(), this.getLastDayOfMonth().getDate()+i) )
    }
    return days;
  }
  getDaysInMonth():Date[] {
    let days:Date[] = [];
    for (let i = 1; i <= this.getLastDayOfMonth().getDate(); i++) {
      days.push( new Date(this.today.getFullYear(), this.today.getMonth(), i) );
    }
    return days;
  }

  // buttons
  nextMonth() {
    this.today = new Date(this.today.getFullYear(), this.today.getMonth()+1, 1);
    this.setDaysInTheMonth()
  }
  prevMonth() {
    this.today = new Date(this.today.getFullYear(), this.today.getMonth()-1, 1);
    this.setDaysInTheMonth()
  }
}
