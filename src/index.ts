import express,{ Express } from 'express';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route';
import tweetRoutes from './routes/tweet.route';
import authRoutes from './routes/auth.route';
import authMiddleware from './middlewares/auth.middleware';

dotenv.config()


const app: Express = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/tweets', authMiddleware, tweetRoutes);
app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));