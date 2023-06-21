import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// create tweet
const createTweet = async (req: Request, res: Response) => {
    const { content, image } = req.body;

    // @ts-ignore

    const user = req.user

    try {

    const newTweet = await prisma.tweet.create({
        data: {
            content,
            image,
            userId: user.id
        }
    })  

    return res.status(201).json(newTweet)

    } catch (error) {
        return res.status(400).json({ error: error});
    }

}


// get tweets
const getTweets = async (req: Request, res: Response) => {
    try {
        const tweets = await prisma.tweet.findMany({
            include: {  
                user:  {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    }
                }  
            }

        })

     return res.status(200).json(tweets)
        
    } catch(error) {
        return res.status(401).json({message: "error: ", error})
    }
   
}


// get tweet
const getTweet = async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.tweet.findUnique({
        where: { id },
        include: { user: true}
    })
        .then(tweet => res.status(200).json(tweet))
        .catch(err => res.status(404).json(err))  

}


// update tweet
const updateTweet = async (req: Request, res: Response) => {
    const { id } = req.params;

    res.status(501).json({message: "No implementation for update tweet"})     

}


// delete tweet
const deleteTweet = async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.tweet.delete({
        where: { id }
    })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(404).json(err))  

}



const tweetController= { createTweet, getTweets, getTweet, updateTweet, deleteTweet }

export default tweetController;