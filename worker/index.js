const key = "company/film";
const noCache = {"cache-control":"no-store"};
const json = data => Response.json(data,{headers:noCache});
export default {async fetch(req,env) {
  const url = new URL(req.url);
  if (!url.pathname.startsWith("/api/")) {
    const file = assets[url.pathname === "/" ? "/index.html" : url.pathname];
    if (!file) return new Response(null,{status:404});
    return new Response(Uint8Array.from(atob(file[1]), c=>c.charCodeAt(0)),{headers:{"content-type":file[0]}});
  }
  const store = env.BUCKET;
  const id = req.headers.get("oai-authenticated-user-id");
  const ownerKey = "company/editor";
  if(url.pathname === "/api/status" && req.method === "GET") {
    const [owner,film] = await Promise.all([store.get(ownerKey),store.head(key)]);
    return json({edit:!!id && (!owner || await owner.text()===id), film:!!film});
  }
  if(url.pathname!=="/api/video") return new Response(null,{status:404});
  if(req.method==="PUT") {
    if (!id || req.headers.get("origin")!==url.origin) return new Response(null,{status:403});
    const type=req.headers.get("content-type");
    const size=Number(req.headers.get("content-length"));
    if(!["video/mp4","video/webm"].includes(type)) return new Response(null,{status:415});
    if(!size || size>95*1024*1024) return new Response(null,{status:413});
    let owner = await store.get(ownerKey);
    if(!owner) {
      await store.put(ownerKey,id,{onlyIf:{etagDoesNotMatch:"*"}});
      owner=await store.get(ownerKey);
    }
    if(!owner || await owner.text()!==id) return new Response(null,{status:403});
    await store.put(key,req.body,{httpMetadata:{contentType:type}});
    return json({ok:true});
  }
  if(!["HEAD","GET"].includes(req.method)) return new Response(null,{status:405});
  const obj= req.method==="HEAD" ? await store.head(key) : await store.get(key,{range:req.headers});
  if(!obj) return new Response(null,{status:404});
  const h=new Headers(noCache);obj.writeHttpMetadata(h);h.set("accept-ranges","bytes");
  let length=obj.size, status=200;
  if(obj.range && "offset" in obj.range && "length" in obj.range) {
    const {offset,length:n}=obj.range;
    length=n;status=206;h.set("content-range",`bytes ${offset}-${offset+n-1}/${obj.size}`);
  }
  h.set("content-length",length);
  return new Response(obj.body || null,{status,headers:h});
}};
