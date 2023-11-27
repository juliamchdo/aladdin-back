import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  await prisma.task.deleteMany();

  const fistDeadline = new Date("2023-11-02T00:00:00.000Z");
  const secondDeadline = new Date("2023-11-02T00:00:00.000Z");
  const thirdDeadline = new Date("2023-11-01T00:00:00.000Z");

  await Promise.all([
    prisma.task.create({
      data: {
        id: "93f1b886-8d54-11ee-b9d1-0242ac120002",
        title: "Limpar a casa",
        deadline: fistDeadline,
        completed: false,
      },
    }),
  ]);

  await Promise.all([
    prisma.task.create({
      data: {
        id: "e7418cd2-8d54-11ee-b9d1-0242ac120002",
        title: "Estudar",
        deadline: secondDeadline,
        completed: false,
      },
    }),
  ]);

  await Promise.all([
    prisma.task.create({
      data: {
        id: "f0a9440e-8d54-11ee-b9d1-0242ac120002",
        title: "Reunião com líderes",
        deadline: thirdDeadline,
        completed: true,
      },
    }),
  ]);
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
