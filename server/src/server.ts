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
                date: new Date(date),
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

    fastify.post('/user/cardPurchases/filter', async (request, reply) => {
        const countCardPurchaseBody = z.object({
            userId: z.string(),
            associatedUserId: z.string(),
            cardId: z.string(),
            month:z.number(),
            year: z.number()
    
        })
        const {userId,associatedUserId,cardId,month,year} = countCardPurchaseBody.parse(request.body)
    
        const cardCloseDate = await prisma.cards.findUnique({
            where: {
                id: cardId
            },
            select:{
                invoiceClosingDate: true,
            }
        })

        if(cardCloseDate){
            const moment = require('moment-timezone')
            const timezone = 'UTC'

            const filterInitDate = new Date(year,month-2,cardCloseDate.invoiceClosingDate)
            filterInitDate.setUTCHours(0, 0, 0, 0)
            //console.log(filterInitDate)
            //const filterInitDate = moment(filterData).tz(timezone).toDate()
            const filterEndDate = new Date(filterInitDate.getFullYear(),filterInitDate.getMonth()+1,filterInitDate.getDate())
            filterEndDate.setUTCHours(0, 0, 0, 0)
            //const filterInitDate = moment.tz({ year: year, month:month -2 , day: cardCloseDate.invoiceClosingDate }, timezone).toDate()
            //console.log(filterInitDate.getDate())
            //const filterEndDate = moment.tz({ year: filterInitDate.getFullYear(), month:filterInitDate.getMonth()+1, day: filterInitDate.getDate()}, timezone).toDate()
            //const filterEndDate = new Date(filterInitDate.getFullYear(),filterInitDate.getMonth()+1,filterInitDate.getDate())
            console.log(filterInitDate)
            console.log(filterEndDate)
            const purchasesFilter = await prisma.cardPurchases.findMany({
                where: {
                    AND: {
                        userId,
                        associatedUserId,
                        cardId,
                        date:{
                            gte:filterInitDate,
                            lt:filterEndDate
                        }
                    }
                }
                
            })

            return reply.status(200).send(JSON.stringify(purchasesFilter))
        }else{
            reply.status(400).send({
                message: 'Card not found.'
            })
        }
        
    
        
    })

    await fastify.listen({ port: 3333 })
}



bootstrap()
