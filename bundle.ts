export {};

const [diagnostics, emit] = await Deno.bundle( "./ws/clientWebsocket.ts", undefined, {
    lib: ["dom"],
    outDir: "./public"
  }
);

await Deno.writeTextFile("./public/clientwebsocket.bundle.v2.js", emit);
