import book_list from "../../mcmasteful-book-list.json";
import { z } from "zod";
import Koa from "koa";
import cors from "@koa/cors";
import { ZodRouter } from 'koa-zod-router';
import { listenerCount } from "process";

export default function books_list(router: ZodRouter) {

router.register({
    name: "list books",
    method: "get",
    path: "/books",
    validate: {
        query: z.object({ filters: z.object({
            from: z.coerce.number().optional(),
            to: z.coerce.number().optional()
        }).array().optional()
    })
    },
    handler: async (ctx, next) => {
        const { filters } = ctx.request.query;
        
        // If there are no filters we can return the list directly
        if (!filters || filters.length === 0) {
            ctx.body = book_list;
            await next();
            return;
        }

        // We can use a record to prevent duplication - so if the same book is valid from multiple sources
        // it'll only exist once in the record.
        // We set the value to "true" because it makes checking it later when returning the result easy.
        let filtered : Record<number, true> = {};

        for (let {from, to} of filters) {
            for (let [index, { price }] of book_list.entries()) {
                let matches = true;
                if (from && price < from) {
                    matches = false;
                }
                if (to && price > to) {
                    matches = false;
                }
                if (matches) {
                    filtered[index] = true;
                }
            }
        }
        const list = book_list.filter((book, index) => filtered[index] === true);
        console.log(list);
        ctx.body = list;
        await next();
    }
});
}
