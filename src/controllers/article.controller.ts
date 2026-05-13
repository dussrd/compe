import { Request, Response } from "express";
import { Article, ArticleI } from "../models/Article";
import { Blog } from "../models/Blog";

export class ArticleController {
  public async getAllArticles(req: Request, res: Response) {
    try {
      const articles: ArticleI[] = await Article.findAll({
        where: {
          status: "ACTIVE",
        },
        include: [
          {
            model: Blog,
            where: {
              status: "ACTIVE",
            },
            required: false,
          },
        ],
      });

      res.status(200).json({ articles });
    } catch (error) {
      res.status(500).json({ error: "Error fetching articles" });
    }
  }

  public async getArticleById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;

      const article = await Article.findOne({
        where: {
          id: pk,
          status: "ACTIVE",
        },
        include: [
          {
            model: Blog,
            where: {
              status: "ACTIVE",
            },
            required: false,
          },
        ],
      });

      if (article) {
        res.status(200).json({ article });
      } else {
        res.status(404).json({ error: "Article not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching article" });
    }
  }

  public async createArticle(req: Request, res: Response) {
    const {
      blogId,
      title,
      content,
      publicationDate,
      views,
      status,
    } = req.body;

    try {
      const blogExist = await Blog.findOne({
        where: {
          id: blogId,
          status: "ACTIVE",
        },
      });

      if (!blogExist) {
        return res.status(404).json({
          error: "Blog not found or inactive",
        });
      }

      const body: ArticleI = {
        blogId,
        title,
        content,
        publicationDate,
        views,
        status,
      };

      const newArticle = await Article.create({ ...body });

      res.status(201).json(newArticle);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async updateArticle(req: Request, res: Response) {
    const { id: pk } = req.params;

    const {
      blogId,
      title,
      content,
      publicationDate,
      views,
      status,
    } = req.body;

    try {
      const articleExist = await Article.findOne({
        where: {
          id: pk,
          status: "ACTIVE",
        },
      });

      if (!articleExist) {
        return res.status(404).json({
          error: "Article not found or inactive",
        });
      }

      if (blogId) {
        const blogExist = await Blog.findOne({
          where: {
            id: blogId,
            status: "ACTIVE",
          },
        });

        if (!blogExist) {
          return res.status(404).json({
            error: "Blog not found or inactive",
          });
        }
      }

      const body: ArticleI = {
        blogId,
        title,
        content,
        publicationDate,
        views,
        status,
      };

      await articleExist.update(body);

      res.status(200).json(articleExist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async deleteArticle(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;

      const articleToDelete = await Article.findOne({
        where: {
          id: pk,
        },
      });

      if (articleToDelete) {
        await articleToDelete.destroy();
        res.status(200).json({ message: "Article deleted successfully" });
      } else {
        res.status(404).json({ error: "Article not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting article" });
    }
  }

  public async deleteArticleAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;

      const articleToUpdate = await Article.findOne({
        where: {
          id: pk,
          status: "ACTIVE",
        },
      });

      if (articleToUpdate) {
        await articleToUpdate.update({
          status: "INACTIVE",
        });

        res.status(200).json({ message: "Article marked as inactive" });
      } else {
        res.status(404).json({ error: "Article not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking article as inactive" });
    }
  }
}