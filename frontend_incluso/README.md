# Incluso — Frontend

Frontend em Next.js (App Router) + Tailwind para a plataforma de cursos acessível.

## Como rodar

```bash
npm install
npm run dev
```

## Arquitetura de pastas

```
incluso-frontend/
├── app/                          # Next.js App Router (rotas = pastas)
│   ├── layout.jsx                 # <html lang="pt-BR">, skip link, fontes
│   ├── globals.css                # Tailwind + reset de foco/motion
│   ├── page.jsx                   # Home (fora do escopo detalhado deste pedido)
│   ├── cursos/
│   │   └── page.jsx               # Listagem de cursos (Server Component)
│   └── aulas/[lessonId]/
│       └── page.jsx               # Tela do player (Server Component)
├── components/
│   ├── player/
│   │   └── VideoPlayer.jsx        # Player acessível com legendas .vtt
│   ├── courses/
│   │   ├── CourseCatalog.jsx      # "use client" — estado dos filtros
│   │   ├── CourseFilters.jsx      # Select de categoria + radio de acessibilidade
│   │   └── CourseCard.jsx         # Card individual com badges e progresso
│   └── ui/
│       └── AccessibilityBadge.jsx # Badge reutilizável (legenda IA, LIBRAS...)
├── lib/
│   └── courses.js                 # Hoje mock; troque pelo fetch real da API
├── tailwind.config.js             # Tokens de cor + regra de contraste (leia os comentários)
└── postcss.config.js
```

**Por que Server Component para as páginas e Client Component só para os pedaços
interativos?** `app/cursos/page.jsx` busca os dados no servidor (zero JS extra
no cliente só para isso) e passa para `CourseCatalog`, que é quem precisa de
`useState` para os filtros. Isso mantém o JS enviado ao navegador no mínimo
necessário — só vira `"use client"` o que de fato precisa rodar no navegador.

## Tokens de cor e contraste (WCAG 2.1)

As cores pedidas batem exatamente com tons padrão do Tailwind:

| Token pedido | Hex | Tailwind |
|---|---|---|
| Primary | `#2563EB` | `blue-600` |
| Secondary | `#14B8A6` | `teal-500` |
| Accent | `#F59E0B` | `amber-500` |
| Background | `#F8FAFC` | `slate-50` |
| Texto | `#1E293B` | `slate-800` |

Por isso `tailwind.config.js` mapeia `primary`→`blue`, `secondary`→`teal`,
`accent`→`amber`, `ink`→`slate`, em vez de uma paleta nova — você ganha a
escala completa (50 a 900) de cada cor de graça.

**O ponto que importa:** medi a razão de contraste real de cada combinação
(fórmula WCAG, relative luminance) antes de usar qualquer cor. Resultado:

- `primary-600` (#2563EB) + texto branco → **5.17:1** ✅ passa AA normal
- `secondary-500` (#14B8A6) + texto branco → **2.49:1** ❌ falha (mínimo 4.5:1)
- `accent-500` (#F59E0B) + texto branco → **2.15:1** ❌ falha

Ou seja: as cores secondary/accent *como foram pedidas* não podem virar fundo
sólido com texto branco em cima — eu literalmente testei o hex enviado e ele
não passa. A solução não foi trocar a cor (ela continua sendo a marca), foi
usar o tom `-700` da mesma família nesses casos (`secondary-700` = `#0F766E`
→ 5.47:1, `accent-700` = `#B45309` → 5.02:1). Os tons `-500` originais ficam
livres para uso decorativo, ícones grandes (≥24px, que só precisam de 3:1) e
fundos bem claros (`-50`/`-100`) combinados com texto `-700`/`-800`.

Essa regra está documentada como comentário direto no `tailwind.config.js` e
aplicada em `AccessibilityBadge.jsx` e nos botões do `VideoPlayer.jsx` — é
o motivo do botão de legenda ativo usar `bg-secondary-700`, não
`bg-secondary-500`.

## Decisões de acessibilidade no VideoPlayer

1. **`<track kind="captions">` real**, não legenda desenhada por JS — funciona
   com leitor de tela e com as preferências do sistema operacional.
2. Trocar o `controls` nativo por uma barra customizada significa que **nós**
   passamos a ser responsáveis pelo teclado: cada controle é um `<button>`
   real (nunca `<div onClick>`), com `aria-label` e `aria-pressed` nos toggles,
   e a barra de progresso é um `<input type="range">` nativo (suporte a seta
   do teclado de graça).
3. `subtitleStatus` (vindo do `subtitle_status` do backend) controla o botão
   de legenda: desabilitado com motivo claro quando a IA ainda está
   processando ou falhou — em vez de simplesmente não reagir ao clique.
4. Espaço de PiP para o intérprete de LIBRAS sempre presente (mesmo sem
   vídeo), com `role="group"` e rótulo explicando o estado — para não
   esconder da pessoa surda que o recurso existe.
5. `:focus-visible` e `prefers-reduced-motion` tratados globalmente em
   `globals.css`, não característica por característica.

## Próximos passos sugeridos (fora do escopo deste pedido)

- Trocar `lib/courses.js` pelas chamadas reais ao backend (`/courses`,
  `/lessons/:id`, `/lessons/:id/subtitle-status` para polling do status da IA).
- Telas de Home completa, painel do instrutor e painel do tradutor de LIBRAS.
- Contexto de autenticação (JWT) e roteamento por papel (STUDENT/INSTRUCTOR/TRANSLATOR).
