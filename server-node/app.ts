import express, { Request, Response } from 'express';
import cors from 'cors';


import { calendarRouter } from "./routes/booking";

const app = express();
app.use(express.json());
app.use(cors())
app.use(express.static('public'));

//routes
app.use('/api/booking', calendarRouter);


app.get("*", (req: Request, res: Response) => {
  res.redirect("/");
})

const PORT = process.env.PORT || 3700;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));