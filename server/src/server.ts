import Fastify from 'fastify'
import {PrismaClient} from '@prisma/client'
import cors from '@fastify/cors'
import {z} from 'zod'

const prisma = new PrismaClient({
    log: ['query'],
})

async function bootstrap(){
    const fastify = Fastify({
        logger: true,
    }) //dispara logs de funcionamento

    await fastify.register(cors, {
        origin: true,
    })

    fastify.get('/test', async () => {
        const users = await prisma.users.count()
        // const users = await prisma.users.findMany({
        //     where: {
        //         name: {
        //             startsWith: 't'
        //         }
        //     }
        // })
        return { users }
    })

    fastify.post('/user', async (request, reply) => {
        const createUserBody = z.object({
            name: z.string(),
            email: z.string(),
            avatarUrl: z.string().nullable(),
        })
        const {name,email,avatarUrl} = createUserBody.parse(request.body)

        await prisma.users.create({
            data: {
                name,
                email,
                avatarUrl,
                AssociatedUsers: {
                    create: {
                        name
                    }
                }
                
            }
        })

        return reply.status(201).send({name})
    })

    fastify.post('/user/associated', async (request, reply) => {
        const createUserBody = z.object({
            name: z.string(),
            userId: z.string(),
        })
        const {name,userId} = createUserBody.parse(request.body)

        await prisma.associatedUsers.create({
            data: {
                name,
                userId,
            }
        })

        return reply.status(201).send({name})
    })

    fastify.post('/user/associated/count', async (request, reply) => {
        const createUserBody = z.object({
            userId: z.string(),
        })
        const {userId} = createUserBody.parse(request.body)

        const associatedUsersCount = await prisma.associatedUsers.count({
            where: {
                userId: {
                    equals: userId
                }
            }
            
        })

        return reply.status(200).send({associatedUsersCount})
    })

    fastify.post('/user/card', async (request, reply) => {
        const createCardBody = z.object({
            name: z.string(),
            invoiceClosingDate:z.number(),
            invoiceDueDate: z.number(),
            userId: z.string(),
        })
        const {name,invoiceClosingDate,invoiceDueDate,userId} = createCardBody.parse(request.body)

        await prisma.cards.create({
            data: {
                name,
                invoiceClosingDate,
                invoiceDueDate,
                userId,
            }
        })

        return reply.status(201).send({name})
    })

    fastify.post('/user/card/count', async (request, reply) => {
        const countUserBody = z.object({
            userId: z.string(),
        })
        const {userId} = countUserBody.parse(request.body)

        const cardsCount = await prisma.cards.count({
            where: {
                userId: {
                    equals: userId
                }
            }
            
        })

        return reply.status(200).send({cardsCount})
    })

    fastify.post('/user/cardPurchases', async (request, reply) => {
        const createCardPurchaseBody = z.object({
            purchasePrice: z.string(),
            installments:z.number(),
            date: z.string(),
            category: z.string(),
            description: z.string(),
            userId: z.string(),
            associatedUserId: z.string(),
            cardId: z.string()
        })
        
        const {purchasePrice,installments,date,category,description,userId,associatedUserId,cardId} = createCardPurchaseBody.parse(request.body)

        await prisma.cardPurchases.create({
            data: {
                purchasePrice,
                installments,
                date,
                category,
                description,
                userId,
                associatedUserId,
                cardId
            }
        })

        return reply.status(201).send({date})
    })

    fastify.post('/user/cardPurchases/count', async (request, reply) => {
        const countCardPurchaseBody = z.object({
            userId: z.string(),
            associatedUserId: z.string(),
        })
        const {userId,associatedUserId} = countCardPurchaseBody.parse(request.body)

        const purchasesCount = await prisma.cardPurchases.count({
            where: {
                userId: {
                    equals: userId
                }
            }
            
        })

        return reply.status(200).send({purchasesCount})
    })

    await fastify.listen({ port: 3333 })
}


bootstrap()
