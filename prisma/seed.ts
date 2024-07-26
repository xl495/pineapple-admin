import { PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';

const prisma = new PrismaClient();

const roles = [
  {
    name: 'ADMIN',
  },
  {
    name: 'USER',
  },
];

async function main() {
  await prisma.role.createMany({
    data: roles,
  });

  const role = await prisma.role.findMany();

  const salt = genSaltSync(8);

  const hashedPassword = hashSync('123456', salt);

  const adminUser = await prisma.user.create({
    data: {
      email: 's@a.com',
      name: 's',
      nickName: 's',
      password: hashedPassword,
      roles: {
        connect: [{ id: role[0].id }],
      },
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@a.com',
      name: 'user',
      nickName: 'user',
      password: hashedPassword,
      roles: {
        connect: [{ id: role[1].id }],
      },
    },
  });

  console.log({ role, adminUser, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
