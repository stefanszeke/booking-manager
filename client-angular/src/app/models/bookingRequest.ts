export interface BookingRequest {
  client: {
    email: string;
    phone: string;
  },
  dates: {
    checkIn: number;
    checkOut: number;
  },
  people: {
    adults: number;
    children: number;
  }
}