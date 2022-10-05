import { Request, Response } from "express"
import { Database } from "../database/database"
import AppServices from "../services/appServices"
import { BookingRequest } from "../models/bookingRequest"

export const bookingRequest = async (req: Request, res: Response) => {
  try {

    const bookingRequest: BookingRequest = req.body;

    const validation: boolean = await AppServices.bookingValidation(res, bookingRequest);
    if(!validation) return;

    let insertQuery = `INSERT INTO bookings (checkIn, checkOut, adults, children, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)`
    let insertOptions = [bookingRequest.dates.checkIn, bookingRequest.dates.checkOut, bookingRequest.people.adults, bookingRequest.people.children, bookingRequest.client.email, bookingRequest.client.phone, "pending"]
  
    await Database.useMySql(insertQuery, insertOptions)
  
    res.json({message: "Booking request sent"})

  } catch (error) { console.log(error) }

}