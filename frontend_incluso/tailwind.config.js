const colors = require("tailwindcss/colors");

/**
 * PONTO CRÍTICO DE ACESSIBILIDADE — leia antes de usar `secondary` ou `accent`:
 *
 * As cores pedidas (#2563EB azul, #14B8A6 turquesa, #F59E0B âmbar) batem
 * exatamente com os tons 600/500/500 da paleta padrão do Tailwind
 * (blue-600, teal-500, amber-500) — por isso usamos as famílias completas
 * do Tailwind em vez de inventar uma paleta nova.
 *
 * Testado contra WCAG 2.1 (fundo #F8FAFC / texto #1E293B):
 *   - primary-600  (#2563EB) + texto branco  -> 5.17:1  OK para texto normal
 *   - secondary-500 (#14B8A6) + texto branco -> 2.49:1  FALHA (mínimo é 4.5:1)
 *   - accent-500    (#F59E0B) + texto branco -> 2.15:1  FALHA
 *   - secondary-700 (#0F766E) + texto branco -> 5.47:1  OK
 *   - accent-700    (#B45309) + texto branco -> 5.02:1  OK
 *
 * REGRA: secondary-500 e accent-500 (as cores "de marca" originais) só
 * podem ser usadas decorativamente — ícones grandes (≥24px, exigem só 3:1),
 * bordas, ou como fundo bem claro (-50/-100) com texto -700/-800 em cima.
 * Qualquer botão/badge sólido com texto branco usa o -700, não o -500.
 */
module.exports = {
    content: [
        "./app/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: colors.blue,     // primary-600 = #2563EB (cor pedida)
                secondary: colors.teal,   // secondary-500 = #14B8A6 (cor pedida)
                accent: colors.amber,     // accent-500 = #F59E0B (cor pedida)
                ink: colors.slate         // ink-50 = #F8FAFC (bg) · ink-800 = #1E293B (texto)
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"]
            }
        }
    },
    plugins: []
};
