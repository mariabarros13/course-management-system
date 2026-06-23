"use client";

import { useEffect, useRef, useState } from "react";

/**
 * PONTOS CRÍTICOS DE ACESSIBILIDADE deste componente:
 *
 * 1. Trocamos o atributo `controls` nativo por uma barra customizada — então
 *    SOMOS NÓS quem garante teclado/leitor de tela, o navegador não ajuda
 *    mais de graça. Cada botão é um <button> real (focável, com aria-label
 *    e aria-pressed quando é um toggle), nunca uma <div onClick>.
 * 2. A legenda vem de uma <track kind="captions"> de verdade (não texto
 *    sobreposto via JS), então funciona com qualquer leitor de tela e com
 *    as preferências de legenda do sistema operacional do usuário.
 * 3. `subtitleStatus` reflete o campo subtitle_status do backend
 *    (none | processing | completed | failed) — o botão de legenda já nasce
 *    desabilitado com um motivo claro quando a IA ainda não terminou ou falhou,
 *    em vez de simplesmente não fazer nada quando clicado.
 */

const PLAY_ICON = (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <path d="M7 5v14l12-7z" fill="currentColor" />
    </svg>
);

const PAUSE_ICON = (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" />
    </svg>
);

const CAPTIONS_ICON = (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <text x="6" y="15" fontSize="7" fill="currentColor" fontWeight="700">CC</text>
    </svg>
);

const FULLSCREEN_ICON = (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path
            d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
            fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        />
    </svg>
);

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export default function VideoPlayer({
    title,
    src,
    posterUrl,
    captionsUrl = null,
    subtitleStatus = "none", // 'none' | 'processing' | 'completed' | 'failed'
    librasVideoUrl = null
}) {
    const videoRef = useRef(null);
    const librasVideoRef = useRef(null);
    const trackRef = useRef(null);
    const containerRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [captionsOn, setCaptionsOn] = useState(subtitleStatus === "completed");
    const [isFullscreen, setIsFullscreen] = useState(false);

    const captionsAvailable = subtitleStatus === "completed" && !!captionsUrl;

    // Mantém o <track> sincronizado com o estado captionsOn.
    useEffect(() => {
        if (trackRef.current?.track) {
            trackRef.current.track.mode = captionsOn && captionsAvailable ? "showing" : "hidden";
        }
    }, [captionsOn, captionsAvailable]);

    useEffect(() => {
        const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener("fullscreenchange", onFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);

    function togglePlay() {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
            librasVideoRef.current?.play().catch(() => {});
        } else {
            video.pause();
            librasVideoRef.current?.pause();
        }
    }

    function handleSeek(event) {
        const value = Number(event.target.value);
        if (videoRef.current) videoRef.current.currentTime = value;
        if (librasVideoRef.current) librasVideoRef.current.currentTime = value;
        setCurrentTime(value);
    }

    function toggleCaptions() {
        if (!captionsAvailable) return;
        setCaptionsOn((prev) => !prev);
    }

    function toggleFullscreen() {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }

    // Espaço alterna play/pause quando o player está focado — replica o
    // atalho que o `controls` nativo dava de graça e que perdemos ao
    // trocar por uma barra customizada.
    function handleKeyDown(event) {
        if (event.code === "Space" || event.key === " ") {
            event.preventDefault();
            togglePlay();
        }
    }

    const captionsButtonTitle = captionsAvailable
        ? (captionsOn ? "Desativar legendas" : "Ativar legendas")
        : subtitleStatus === "processing"
            ? "Legenda sendo gerada pela IA — ainda não disponível"
            : subtitleStatus === "failed"
                ? "Não foi possível gerar a legenda desta aula"
                : "Esta aula não possui legenda";

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-xl bg-black"
            onKeyDown={handleKeyDown}
        >
            <video
                ref={videoRef}
                src={src}
                poster={posterUrl}
                className="w-full aspect-video"
                onClick={togglePlay}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                aria-label={title}
            >
                {captionsAvailable && (
                    <track
                        ref={trackRef}
                        kind="captions"
                        src={captionsUrl}
                        srcLang="pt-BR"
                        label="Português"
                        default
                    />
                )}
            </video>

            {/* Espaço reservado para o vídeo do intérprete de LIBRAS (PiP).
                Continua presente mesmo sem librasVideoUrl, com um rótulo
                explicando o estado — em vez de simplesmente desaparecer,
                o que esconderia da pessoa surda que o recurso existe e
                pode estar disponível em outra aula. */}
            <div
                className="absolute bottom-20 right-3 w-28 sm:w-36 aspect-[3/4] rounded-lg border-2 border-white/70 bg-ink-800/90 overflow-hidden flex items-center justify-center"
                role="group"
                aria-label="Vídeo do intérprete de LIBRAS"
            >
                {librasVideoUrl ? (
                    <video
                        ref={librasVideoRef}
                        src={librasVideoUrl}
                        className="h-full w-full object-cover"
                        muted
                        aria-hidden="true"
                    />
                ) : (
                    <span className="px-2 text-center text-[11px] leading-tight text-white/80">
                        Sem intérprete de LIBRAS nesta aula
                    </span>
                )}
            </div>

            {/* Barra de controles customizada */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-8">
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    aria-label="Progresso do vídeo"
                    className="w-full accent-primary-600 cursor-pointer"
                />

                <div className="mt-2 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                        className="rounded-full p-2 text-white hover:bg-white/15 focus-visible:outline-white"
                    >
                        {isPlaying ? PAUSE_ICON : PLAY_ICON}
                    </button>

                    <span className="text-xs tabular-nums text-white/90" aria-hidden="true">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <div className="flex-1" />

                    <button
                        type="button"
                        onClick={toggleCaptions}
                        disabled={!captionsAvailable}
                        aria-pressed={captionsOn && captionsAvailable}
                        aria-label="Ativar ou desativar legendas"
                        title={captionsButtonTitle}
                        className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition
                            ${captionsAvailable
                                ? (captionsOn ? "bg-secondary-700 text-white" : "bg-white/10 text-white hover:bg-white/20")
                                : "cursor-not-allowed bg-white/5 text-white/40"}`}
                    >
                        {CAPTIONS_ICON}
                        <span className="hidden sm:inline">Legendas</span>
                    </button>

                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-pressed={isFullscreen}
                        aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
                        className="rounded-md p-2 text-white hover:bg-white/15"
                    >
                        {FULLSCREEN_ICON}
                    </button>
                </div>

                {subtitleStatus === "processing" && (
                    <p className="mt-1 text-[11px] text-white/70" role="status">
                        A legenda desta aula está sendo gerada pela IA. Tente novamente em alguns minutos.
                    </p>
                )}
                {subtitleStatus === "failed" && (
                    <p className="mt-1 text-[11px] text-accent-500" role="alert">
                        Não foi possível gerar a legenda automática desta aula.
                    </p>
                )}
            </div>
        </div>
    );
}
