import { Router } from "express"; 
import tweetController from "../controllers/tweet.controller";

const router = Router();


router.get('/', tweetController.getTweets)

router.post('/', tweetController.createTweet)


router.route('/:id')
.get(tweetController.getTweet)
.put(tweetController.updateTweet)
.delete(tweetController.deleteTweet)

export default router;