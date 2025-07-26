
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'
import path from 'path'

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors())

// Serve images from the "uploads" folder
app.use('/uploads', express.static('uploads'))

await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

app.get('/', (req, res) => res.send("API Working"))

app.listen(PORT, () => console.log("Server Running on port " + PORT))
