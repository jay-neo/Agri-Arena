import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const schemes = [
    {
      name: "Pradhan Mantri Kisan Samman Nidhi",
      link: "https://pmkisan.gov.in/",
      expiresAt: null,
    },
    {
      name: "National Agriculture Market (eNAM)",
      link: "https://www.enam.gov.in/",
      expiresAt: null,
    },
    {
      name: "Department of Agriculture and Farmers Welfare",
      link: "https://agriwelfare.gov.in/",
      expiresAt: null,
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana",
      link: "https://pmfby.gov.in/",
      expiresAt: new Date("2026-05-25T00:00:00Z"), // Example expiration
    },
    {
      name: "Krishonnati Yojana",
      link: "https://agricoop.nic.in/en/krishonnati-yojana",
      expiresAt: null,
    },
  ];

  for (const scheme of schemes) {
    await prisma.forecastAgricultureSchema.upsert({
      where: {
        name_link: {
          name: scheme.name,
          link: scheme.link,
        },
      },
      update: {
        name: scheme.name,
        expiresAt: scheme.expiresAt,
      },
      create: {
        name: scheme.name,
        link: scheme.link,
        expiresAt: scheme.expiresAt,
      },
    });
    console.log(`Upserted scheme: ${scheme.name}`);
  }
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
