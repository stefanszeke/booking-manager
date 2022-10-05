import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = environment.apiUrl;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

  sendBookingRequest(data: any) {
    return this.http.post(`${this.url}/booking`, data, { headers: this.headers });
  }
}
