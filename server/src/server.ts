import Fastify from 'fastify'
import {PrismaClient} from '@prisma/client'
import cors from '@fastify/cors'

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
        const users = await prisma.users.count({
            where: {
                name: {
                    startsWith: 't'
                }
            }
        })
        // const users = await prisma.users.findMany({
        //     where: {
        //         name: {
        //             startsWith: 't'
        //         }
        //     }
        // })
        return { users }
    })
    fastify.post('/create', async (request, reply) => {
        const {title} = request.body

        return reply.status(201).send({ title })
    })

    await fastify.listen({ port: 3333 })
}


bootstrap()
