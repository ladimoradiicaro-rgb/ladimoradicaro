// Il dominio senza www rimanda sempre a www.ladimoradicaro.com (stessa versione dei canonical).
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === "ladimoradicaro.com") {
    url.hostname = "www.ladimoradicaro.com";
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
