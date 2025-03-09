import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { insertContactSchema, insertBlogPostSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
export async function registerRoutes(app: Express) {
-0
+62
    }
  });
  // Blog post routes
  app.post("/api/blog", async (req, res) => {
    try {
      const post = insertBlogPostSchema.parse(req.body);
      const result = await storage.createBlogPost(post);
      res.json(result);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: fromZodError(err).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app.patch("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, updates);
      res.json(post);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: fromZodError(err).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const httpServer = createServer(app);
  return httpServer;
}
