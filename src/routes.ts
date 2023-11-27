import { prisma } from './lib/prisma';
import { z } from 'zod';
import { FastifyInstance } from 'fastify';

export async function appRoutes(app: FastifyInstance){
    app.post('/create', async(request) => {
        const createTask = z.object({
            title: z.string(),
            deadline: z.coerce.date(),
        });

        const { title, deadline } = createTask.parse(request.body);

        const tasks = await prisma.task.create({
            data: {
                title: title,
                deadline: deadline,
                completed: false
            }
        })

        return tasks;
    });

    app.patch('/tasks/:id/toggle', async (request) => {
        const toggleTaskParam = z.object({
            id: z.string().uuid()
        });

        const { id } = toggleTaskParam.parse(request.params);

        let task = await prisma.task.findUnique({
            where:{
                id: id
            }
        });

        if(task?.completed === true){
            await prisma.task.update({
                where:{
                    id: id
                },
                data:{
                    completed: false
                }
            })
        } else {
            await prisma.task.update({
                where:{
                    id: id
                },
                data:{
                    completed: true
                }
            })
        }
    })


    app.delete('/delete/:id', async(request) => {
        const deleteTask = z.object({
            id: z.string()
        });

        const { id } = deleteTask.parse(request.params);

        await prisma.task.delete({
            where: {
                id: id
            }
        })
    });

    app.get('/today', async() => {

        const parsedDate = new Date();
        const today = parsedDate.toISOString().replace(/T\d+:\d+:\d+\.\d+Z/, 'T00:00:00.000Z')

        const openedTasks = await prisma.task.findMany({
            where:{
                completed: false,
                deadline: today

            },
            orderBy: {
                deadline: 'asc'
            },
        })

        return openedTasks;
    });
    

    app.get('/open', async() => {

        const openedTasks = await prisma.task.findMany({
            where:{
                completed: false
            },
            orderBy: {
                deadline: 'asc'
            },
        })

        return openedTasks;
    });

    app.get('/completed', async() => {

        const openedTasks = await prisma.task.findMany({
            where:{
                completed: true,
            },
            orderBy: {
                deadline: 'asc'
            },
        })

        return openedTasks;
    });

}