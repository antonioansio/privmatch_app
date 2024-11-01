const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const db = new PrismaClient();

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

async function main() {
  const cities = [
    { name: "Barcelona", latitude: 41.3851, longitude: 2.1734 },
    { name: "Madrid", latitude: 40.4168, longitude: -3.7038 },
    { name: "Valencia", latitude: 39.4699, longitude: -0.3763 },
    { name: "Málaga", latitude: 36.7213, longitude: -4.4216 },
  ];

  const cityData = await Promise.all(
    cities.map((city) =>
      db.city.upsert({
        where: { name: city.name },
        update: {},
        create: { ...city, slug: slugify(city.name) },
      })
    )
  );

  const cityIdMap = cityData.reduce((acc, city) => {
    acc[city.name] = city.id;
    return acc;
  }, {});

  const subareas = [
    {
      name: "Chueca",
      cityName: "Madrid",
      latitude: 40.4223,
      longitude: -3.6986,
    },
    {
      name: "Eixample",
      cityName: "Barcelona",
      latitude: 41.388,
      longitude: 2.161,
    },
    {
      name: "Malasaña",
      cityName: "Madrid",
      latitude: 40.4282,
      longitude: -3.7045,
    },
    {
      name: "Ruzafa",
      cityName: "Valencia",
      latitude: 39.4605,
      longitude: -0.3763,
    },
    {
      name: "El Carmen",
      cityName: "Valencia",
      latitude: 39.4765,
      longitude: -0.3781,
    },
    {
      name: "La Malagueta",
      cityName: "Málaga",
      latitude: 36.7204,
      longitude: -4.4137,
    },
    {
      name: "Centro Histórico",
      cityName: "Málaga",
      latitude: 36.7213,
      longitude: -4.4216,
    },
    {
      name: "Sant Quirze del Vallès",
      cityName: "Barcelona",
      latitude: 41.534,
      longitude: 2.0823,
    },
  ];

  const subareaData = await Promise.all(
    subareas.map((subarea) =>
      db.subarea.create({
        data: {
          name: subarea.name,
          slug: slugify(subarea.name),
          cityId: cityIdMap[subarea.cityName],
          latitude: subarea.latitude,
          longitude: subarea.longitude,
        },
      })
    )
  );

  const subareasByCity = subareaData.reduce((acc, subarea) => {
    if (!acc[subarea.cityId]) acc[subarea.cityId] = [];
    acc[subarea.cityId].push(subarea);
    return acc;
  }, {});

  const services = ["Masaje", "Acompañante", "Video Llamada", "Cita Privada"];
  const serviceData = await Promise.all(
    services.map((service) =>
      db.service.upsert({
        where: { name: service },
        update: {},
        create: { name: service },
      })
    )
  );

  const languages = ["Español", "Inglés", "Francés"];
  const languageData = await Promise.all(
    languages.map((language) =>
      db.language.upsert({
        where: { name: language },
        update: {},
        create: { name: language },
      })
    )
  );

  for (let i = 0; i < 20; i++) {
    const city = faker.helpers.arrayElement(cityData);
    const subarea = faker.helpers.arrayElement(subareasByCity[city.id]);

    const girl = await db.girl.create({
      data: {
        name: faker.person.firstName("female"),
        age: faker.number.int({ min: 20, max: 45 }),
        cityId: city.id,
        subareaId: subarea.id,
        address: faker.location.streetAddress({ locale: "es" }),
        postalCode: faker.location.zipCode("#####"),
        latitude: faker.location.latitude({ min: 36.7, max: 41.6 }),
        longitude: faker.location.longitude({ min: -5.9, max: 2.3 }),
        description: faker.lorem.paragraph(),
        ratePerHour: faker.number.int({ min: 50, max: 500 }),
        workHours: "10:00-20:00",
        nationality: faker.helpers.arrayElement([
          "Española",
          "Colombiana",
          "Argentina",
        ]),
        heightCm: faker.number.int({ min: 150, max: 180 }),
        weightKg: faker.number.int({ min: 50, max: 80 }),
        acceptsCard: faker.datatype.boolean(),
        acceptsWhatsApp: faker.datatype.boolean(),
        offersVideoCall: faker.datatype.boolean(),
        isVerified: faker.datatype.boolean(),
        isActive: true,
      },
    });

    await db.image.createMany({
      data: [
        {
          url: "https://placehold.co/360x540",
          girlId: girl.id,
          isPrimary: true,
        },
        {
          url: "https://placehold.co/360x540",
          girlId: girl.id,
          isPrimary: false,
        },
        {
          url: "https://placehold.co/360x540",
          girlId: girl.id,
          isPrimary: false,
        },
        {
          url: "https://placehold.co/360x540",
          girlId: girl.id,
          isPrimary: false,
        },
        {
          url: "https://placehold.co/360x540",
          girlId: girl.id,
          isPrimary: false,
        },
      ],
    });

    await db.girl.update({
      where: { id: girl.id },
      data: {
        services: {
          connect: faker.helpers
            .arrayElements(serviceData, faker.number.int({ min: 1, max: 3 }))
            .map((service) => ({ id: service.id })),
        },
        languages: {
          create: [
            {
              language: {
                connect: {
                  id: faker.helpers.arrayElement(languageData).id,
                },
              },
            },
          ],
        },
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect();
  });
