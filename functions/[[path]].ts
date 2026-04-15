export const onRequest: PagesFunction = async (context) => {
  const res = await context.next();
  // Se o servidor retornar 404 (não achou o arquivo físico), 
  // servimos o index.html da raiz para o TanStack Router assumir.
  if (res.status === 404) {
    return context.env.ASSETS.fetch(new URL("/", context.request.url));
  }
  return res;
};