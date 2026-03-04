import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // A própria função updateSession vai verificar e interceptar requisições /admin, /dashboard etc.
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Funciona em todas request paths EXCETO as estáticas e de API (já que usamos o app router base)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
