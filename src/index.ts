import Koa from "koa";
import cors from "@koa/cors";
import zodRouter from 'koa-zod-router';
import qs from "koa-qs";
import books_list from "./books/list";

const app = new Koa();

// We use koa-qs to enable parsing complex query strings, like our filters.
qs(app);

// And we add cors to ensure we can access our API from the mcmasterful-books website
app.use(cors())

const router = zodRouter();

// Setup Book List Route
books_list(router);

app.use(router.routes());

app.listen(3000, () => {
    console.log("listening!")
});