import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { BookingRequest } from "../models/bookingRequest";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = environment.apiUrl;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

  sendBookingRequest(data: BookingRequest): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.url}/booking`, data, { headers: this.headers });
  }
  getReservedDates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/booking/reserved`);
  }
}
