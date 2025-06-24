import { Hono } from "hono";
import { authRouter } from "./auth.js";

const router = new Hono();

router.route("/auth", authRouter);

export default router;
