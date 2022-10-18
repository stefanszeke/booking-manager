export interface BookingRequest {
  email: string;
  phone: string;
  checkIn: number;
  checkOut: number;
  adults: number;
  children: number;
}