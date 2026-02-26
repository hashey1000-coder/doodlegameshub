import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { X, Play } from "lucide-react";
import { GAMES } from "@/data/games";
import { useT } from "@/contexts/LanguageContext";
import { useGameTranslate } from '@/data/gameTranslations';

// Wheel segment colors — vibrant, Google-doodle-inspired palette
const SEGMENT_COLORS = [
  "#4285F4", // Google Blue
  "#EA4335", // Google Red
  "#FBBC05", // Google Yellow
  "#34A853", // Google Green
  "#8B5CF6", // Violet
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#6366F1", // Indigo
  "#EF4444", // Rose
];

// Pick 12 random games for the wheel
function pickWheelGames() {
  const shuffled = [...GAMES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 12);
}

interface SpinWheelProps {
  onClose: () => void;
}

export default function SpinWheel({ onClose }: SpinWheelProps) {
  const t = useT();
  const gt = useGameTranslate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, navigate] = useLocation();
  const [games] = useState(() => pickWheelGames());
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<(typeof GAMES)[0] | null>(null);
  const [rotation, setRotation] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const targetRotationRef = useRef<number>(0);
  const spinDurationRef = useRef<number>(3500);

  const numSegments = games.length;
  const segmentAngle = (2 * Math.PI) / numSegments;

  const drawWheel = useCallback((rot: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer shadow ring
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();

    // Draw segments
    games.forEach((game, i) => {
      const startAngle = rot + i * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Segment border
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 4;

      // Truncate long titles
      const t_title = gt(game).title;
      const label = t_title.length > 16 ? t_title.slice(0, 14) + "…" : t_title;
      ctx.fillText(label, radius - 12, 4);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center emoji
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowBlur = 0;
    ctx.fillText("🎮", cx, cy);
  }, [games, segmentAngle]);

  // Initial draw
  useEffect(() => {
    drawWheel(rotation);
  }, [drawWheel, rotation]);

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

  const spin = () => {
    if (spinning) return;
    setWinner(null);
    setSpinning(true);

    // Pick a random winner index
    const winnerIdx = Math.floor(Math.random() * numSegments);

    // Calculate the target rotation so winner lands at the top (pointer at 270deg = -PI/2)
    // The pointer is at the right side (0 rad), so we want the winner segment's midpoint at 0
    // Winner midpoint angle (relative to wheel) = winnerIdx * segmentAngle + segmentAngle/2
    // We want: rot + winnerMid = -PI/2 (top, where pointer is)
    const winnerMid = winnerIdx * segmentAngle + segmentAngle / 2;
    const targetAngle = -Math.PI / 2 - winnerMid;
    // Add multiple full rotations for drama
    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
    const target = rotation + extraSpins + (targetAngle - (rotation % (2 * Math.PI)));

    targetRotationRef.current = target;
    spinDurationRef.current = 3000 + Math.random() * 1000;
    startTimeRef.current = null;

    const startRot = rotation;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / spinDurationRef.current, 1);
      const easedProgress = easeOut(progress);
      const currentRot = startRot + (target - startRot) * easedProgress;

      setRotation(currentRot);
      drawWheel(currentRot);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setWinner(games[winnerIdx]);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handlePlay = () => {
    if (winner) {
      navigate(`/play/${winner.slug}/`);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('spin.title')}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,10,40,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">🎰 {t('spin.title')}</h2>
            <p className="text-white/70 text-xs mt-0.5">{t('spin.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={t('common.close' as any)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6">
          {/* Wheel + pointer */}
          <div className="relative flex items-center justify-center mb-5">
            {/* Pointer arrow at right */}
            <div
              className="absolute z-10"
              style={{ right: "calc(50% - 160px - 12px)", top: "50%", transform: "translateY(-50%)" }}
            >
              <div
                className="w-0 h-0"
                style={{
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: "20px solid #1e1b4b",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                }}
              />
            </div>

            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="rounded-full"
              style={{ maxWidth: "100%" }}
              role="img"
              aria-label={t('spin.title')}
            />
          </div>

          {/* Winner display */}
          {winner ? (
            <div className="bg-gradient-to-r from-violet-50 to-violet-50 border border-violet-100 rounded-2xl p-4 mb-4 text-center">
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">🎉 {t('spin.youGot')}</p>
              <p className="text-lg font-bold text-slate-900 mb-1">{gt(winner).title}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium capitalize">{t(`category.${winner.category}` as any)}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{t(`difficulty.${winner.difficulty}` as any)}</span>
              </div>
            </div>
          ) : (
            <div className="h-[88px] flex items-center justify-center mb-4">
              <p className="text-slate-400 text-sm text-center">
                {spinning ? `${t('spin.spinning')} 🌀` : t('spin.subtitle')}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {winner ? (
              <>
                <button
                  onClick={spin}
                  disabled={spinning}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {t('spin.spinAgain')}
                </button>
                <button
                  onClick={handlePlay}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-bold text-sm hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg shadow-violet-200 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {t('spin.playNow')}
                </button>
              </>
            ) : (
              <button
                onClick={spin}
                disabled={spinning}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-bold text-base hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg shadow-violet-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {spinning ? t('spin.spinning') : `🎰 ${t('spin.spin')}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
