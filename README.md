# deno-websockets

This project was done by following the net ninja tutorial on [deno websockets](https://www.youtube.com/watch?v=CLLtnaOGIqo&list=PL4cUxeGkcC9gie1HrzOlzGZdEHLKhwNJE)

I made some modifications to bring this in line with what's shown in the deno standard library examples for a [file server](https://deno.land/std/http/file_server.ts) in the http module.

One thing I forgot to account for was that the http server is barebones so remember to handle serving any static files directly or use a middleware module like [oak](https://deno.land/x/oak) that includes router configurations.
