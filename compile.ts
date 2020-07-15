
const [errors, emitMap] = await Deno.compile(
  "./ws/clientWebsocket.ts",
  undefined,
  { 
    lib: ["dom", "esnext", "dom.iterable"],
  });

const iterableMap = new Map(Object.entries(emitMap));

for await (let [key, value] of iterableMap) {
  let realPath = await Deno.realPath('./test');
  realPath += '/' + key.split('/').filter(x => x.includes('js'));
  
  console.log(`${realPath}`);

  await Deno.writeTextFile(`${realPath}`, value);
}

// await Deno.writeTextFile("./public/clientWebsocket.bundle.v1.js", emitMap);