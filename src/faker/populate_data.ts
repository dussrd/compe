import { faker } from "@faker-js/faker";
import { sequelize } from "../database/db";
import { Article } from "../models/Article";
import { Blog } from "../models/Blog";

const BLOGS_TO_CREATE = 10;
const ARTICLES_TO_CREATE = 50;

const createFakeData = async (): Promise<void> => {
  await sequelize.authenticate();
  await sequelize.sync({ force: false });

  const runId = faker.string.alphanumeric(8).toLowerCase();
  const blogs: Blog[] = [];

  for (let i = 0; i < BLOGS_TO_CREATE; i++) {
    const blog = await Blog.create({
      name: `Blog ${faker.word.words({ count: { min: 1, max: 3 } })} ${runId}-${i + 1}`,
      creationDate: faker.date.past({ years: 3 }),
      status: "ACTIVE",
    });

    blogs.push(blog);
  }

  for (let i = 0; i < ARTICLES_TO_CREATE; i++) {
    const blog = faker.helpers.arrayElement(blogs);

    await Article.create({
      blogId: blog.id,
      title: faker.lorem.sentence({ min: 4, max: 10 }).slice(0, 200),
      content: faker.lorem.paragraphs({ min: 2, max: 5 }, "\n\n"),
      publicationDate: faker.date.between({
        from: blog.creationDate,
        to: new Date(),
      }),
      views: faker.number.int({ min: 0, max: 10000 }),
      status: "ACTIVE",
    });
  }

  console.log(
    `Datos falsos creados exitosamente: ${BLOGS_TO_CREATE} blogs y ${ARTICLES_TO_CREATE} articulos.`
  );
};

createFakeData()
  .catch((error) => {
    console.error("Error al crear datos falsos:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
