import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())


app.get("/", (req: Request, res: Response) => {
  res.json({message: "Hello World!"});
})

const PORT = process.env.PORT || 3700;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));