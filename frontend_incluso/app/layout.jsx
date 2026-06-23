import "./globals.css";

export const metadata = {
    title: "Incluso — Aprendizado para todos",
    description: "Plataforma de cursos online com legendas geradas por IA e suporte a LIBRAS."
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body className="bg-ink-50 text-ink-800 font-sans antialiased">
                {/* Skip link: permite quem usa teclado pular a navegação repetida
                    em toda página e ir direto pro conteúdo principal. */}
                <a href="#conteudo-principal" className="sr-only-focusable">
                    Saltar para o conteúdo principal
                </a>

                {children}
            </body>
        </html>
    );
}
