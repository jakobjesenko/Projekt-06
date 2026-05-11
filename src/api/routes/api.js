import { Router } from "express";

import authRouter from "./auth.js";
import usersRouter from "./users.js";
import meetingsRouter from "./meetings.js";
import ratingsRouter from "./ratings.js";
import reportsRouter from "./reports.js";
import suggestionsRouter from "./suggestions.js";
import contactRouter from "./contacts.js";
import messageRouter from "./messages.js";
import dbRouter from "./db.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/meetings", meetingsRouter);
apiRouter.use("/ratings", ratingsRouter);
apiRouter.use("/reports", reportsRouter);
apiRouter.use("/suggestions", suggestionsRouter);
apiRouter.use("/contacts", contactRouter);
apiRouter.use("/messages", messageRouter);
apiRouter.use("/db", dbRouter);

export default apiRouter;