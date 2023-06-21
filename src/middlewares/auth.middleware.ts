import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

const JWT_SECRET = `${process.env.JWT_SECRET}`

type AuthRequest = Request & { user?: User }


const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const jwtToken = authHeader?.split(' ')[1];

    if(!jwtToken) {
        return res.sendStatus(403);
    }

    try {
        
        const payload = await jwt.verify(jwtToken, JWT_SECRET) as { tokenId: string} ;


        if(!payload.tokenId) {
            return res.sendStatus(401);
        }

        const dbToken = await prisma.token.findUnique({
            where:{
                id: payload.tokenId
            },
            include: {
                user: true
            }
        });

        if(!dbToken?.valid || dbToken.expiration < new Date()) {
            return res.status(401).json({ error: "API token not valid!"})
        }

        req.user = dbToken.user;

    } catch (error) {
       return  res.sendStatus(401);
    }

    // return  res.sendStatus(200);

    next();

}

export default authMiddleware;