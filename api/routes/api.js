import { Router } from "express";

import authRouter from "./auth.js";
import usersRouter from "./users.js";
import meetingsRouter from "./meetings.js";
import ratingsRouter from "./ratings.js";
import reportsRouter from "./reports.js";
import suggestionsRouter from "./suggestions.js";
import contactRouter from "./contacts.js";
import messageRouter from "./messages.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/admin/users", usersRouter);
apiRouter.use("/meetings", meetingsRouter);
apiRouter.use("/ratings", ratingsRouter);
apiRouter.use("/reports", reportsRouter);
apiRouter.use("/suggestions", suggestionsRouter);
apiRouter.use("/contacts", contactRouter);
apiRouter.use("/messages", messageRouter);

export default apiRouter;