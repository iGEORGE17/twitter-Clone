import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// create user
const createUser = async (req: Request, res: Response) => {
    const { name, username, email } = req.body;

    try {
        const newUser = await prisma.user.create({
                data: {
                    name, 
                    username, 
                    email,
                    bio: "I'm new on twitter"
                }
            }) 
        
            res.status(201).json(newUser);       
        
    } catch (error:any) {
        res.status(400).json({message: error})
    }

}


// get users
const getUsers = async (req: Request, res: Response) => {
    await prisma.user.findMany()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(400).json(err))
}

// get user
const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.user.findUnique({
        where: { id },
        include: { Tweets: true}
    })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json(err))   
}

// update user
const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, username, bio } = req.body;

    await prisma.user.update({
        where: { id },
        data: {
            name,
            email,
            username,
            bio
        }
    })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json(err))     
}

// delete user
const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.user.delete({
        where: { id },
    })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(400).json(err))    
}


const userController = { createUser, getUsers, getUser, updateUser, deleteUser }

export default userController

