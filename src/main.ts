import express from 'express'
import { userRouter } from './user/user.router';

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", userRouter)

app.listen(3000, async() => {
    console.log('Connected!')
})

