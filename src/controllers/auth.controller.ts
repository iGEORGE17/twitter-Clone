import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { generateJwtToken } from "../utils/jwtTokens";
import { sendEmailToken } from "../services/emailService";

const prisma = new PrismaClient()

const generateEmailToken = (): string => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10
const AUTHENTICATION_EXPIRATION_HOURS = 12


const login = async (req: Request, res: Response) => {
    const { email } = req.body;

    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000);

    try {
        
        const createdToken = await prisma.token.create({
            data: {
                type: "EMAIL",
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email },
                    }
                }
            }
        })
    
        console.log(createdToken);
        await sendEmailToken(email, emailToken);

        return res.sendStatus(200);

    } catch (error) {
        res.status(400).json({ error: error})
        console.log(error);
    }

}


const authenticateUer = async (req: Request, res: Response) => {
    const { email, emailToken } = req.body;

    const dbEmailToken = await prisma.token.findUnique({
        where: {
            emailToken,
        },
        include: {
            user: true,
        }
    })

    if(!dbEmailToken || !dbEmailToken.valid) {
        return res.sendStatus(401);
    }

    if(dbEmailToken.expiration < new Date()) {
        return res.status(401).json({ message: "Token expired!" });
    }
    
    if(dbEmailToken?.user?.email !== email) {
        return res.sendStatus(401)
    }


    const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000);

    const apiToken = await prisma.token.create({
        data: {
            type: 'API',
            expiration,
            user: {
                connect: {
                    email,
                }
            }
        }
    });


    // invalidate the token

    await prisma.token.update({
        where:{
            id: dbEmailToken.id,
        },
        data: {
            valid: false
        }
    });

    // generate jwt token
    const authToken = generateJwtToken(apiToken.id)

    return res.status(200).json(authToken)
}

const authController = { login, authenticateUer };

export default authController;