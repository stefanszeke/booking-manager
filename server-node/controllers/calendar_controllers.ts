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
    let insertOptions = [bookingRequest.checkIn, bookingRequest.checkOut, bookingRequest.adults, bookingRequest.children, bookingRequest.email, bookingRequest.phone, "pending"]
  
    await Database.useMySql(insertQuery, insertOptions)
  
    res.json({message: "Booking request sent"})

  } catch (error) { console.log(error) }

}

export const getReserved = async (req: Request, res: Response) => {
  try {
    let query = `SELECT * FROM bookings WHERE status = 'reserved'`

    let result: any = await Database.useMySql(query)
    let reservedDates: string[] = []
    
    result.forEach((item: any) => {
      let datesToPush: string[] = AppServices.getDatesBetween(item.checkin, item.checkout)
      reservedDates.push(...datesToPush)
    })

    res.json(reservedDates)

  } catch (error) { console.log(error) }
}