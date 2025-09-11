import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "alice@example.com",
      discord_id: "alice123",
      profile: {
        create: {
          display_name: "Alice",
          avatar_url: "https://example.com/alice.png",
          bio: "Hello, I'm Alice",
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "bob@example.com",
      discord_id: "bob456",
      profile: {
        create: {
          display_name: "Bob",
          avatar_url: "https://example.com/bob.png",
          bio: "Hi, I'm Bob",
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
