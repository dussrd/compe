import { Router } from "express";
import { ArticleRoutes } from "./article";
import { BlogRoutes } from "./blog";

export class Routes {
// agrega tus rutas aquí de la siguiente manera
public blogRoutes: BlogRoutes = new BlogRoutes();
public articleRoutes: ArticleRoutes = new ArticleRoutes();
}
