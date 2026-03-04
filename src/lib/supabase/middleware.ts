// src/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresca o token atual e verifica a autenticação do usuário
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protegendo rotas do painel admin
  if (!user && pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Redireciona usuários logados tentando acessar login ou a raiz admin para o dashboard
  // Note: O redirecionamento para o slug específico será feito em um Server Action após o login
  // ou poderíamos fazer uma query aqui, mas o middleware deve ser leve.
  // Se o usuário já está logado e acessa /admin, vamos deixar o layout ou uma page raiz lidar com o redirect para o primeiro slug.
  if (user && pathname === "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin"; // Deixa a raiz do admin decidir para qual slug ir
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
