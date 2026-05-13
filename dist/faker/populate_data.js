"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const db_1 = require("../database/db");
const Article_1 = require("../models/Article");
const Blog_1 = require("../models/Blog");
const BLOGS_TO_CREATE = 10;
const ARTICLES_TO_CREATE = 50;
const createFakeData = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.sequelize.authenticate();
    yield db_1.sequelize.sync({ force: false });
    const runId = faker_1.faker.string.alphanumeric(8).toLowerCase();
    const blogs = [];
    for (let i = 0; i < BLOGS_TO_CREATE; i++) {
        const blog = yield Blog_1.Blog.create({
            name: `Blog ${faker_1.faker.word.words({ count: { min: 1, max: 3 } })} ${runId}-${i + 1}`,
            creationDate: faker_1.faker.date.past({ years: 3 }),
            status: "ACTIVE",
        });
        blogs.push(blog);
    }
    for (let i = 0; i < ARTICLES_TO_CREATE; i++) {
        const blog = faker_1.faker.helpers.arrayElement(blogs);
        yield Article_1.Article.create({
            blogId: blog.id,
            title: faker_1.faker.lorem.sentence({ min: 4, max: 10 }).slice(0, 200),
            content: faker_1.faker.lorem.paragraphs({ min: 2, max: 5 }, "\n\n"),
            publicationDate: faker_1.faker.date.between({
                from: blog.creationDate,
                to: new Date(),
            }),
            views: faker_1.faker.number.int({ min: 0, max: 10000 }),
            status: "ACTIVE",
        });
    }
    console.log(`Datos falsos creados exitosamente: ${BLOGS_TO_CREATE} blogs y ${ARTICLES_TO_CREATE} articulos.`);
});
createFakeData()
    .catch((error) => {
    console.error("Error al crear datos falsos:", error);
    process.exitCode = 1;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.sequelize.close();
}));
