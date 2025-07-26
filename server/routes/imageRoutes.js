import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { generateImage } from '../controllers/imageControllers.js'
import userAuth from '../middlewares/auth.js'

const imageRouter = express.Router()

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  },
})

const upload = multer({ storage })

// Your existing generate-image route (protected)
imageRouter.post('/generate-image', userAuth, generateImage)

// New route to upload image (unprotected or protected as you want)
imageRouter.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }
  const filePath = `/uploads/${req.file.filename}`
  res.status(200).json({ message: 'Upload successful', filePath })
})

export default imageRouter
