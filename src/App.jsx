import { useEffect, useRef, useState } from "react";
import "./App.css";

const TOTAL_FRAMES = 93;
const SCROLL_DISTANCE = 900; // px of wheel/touch delta needed to play through all frames

function framePath(i) {
  return `/video_frames/web_video_${String(i).padStart(5, "0")}.png`;
}

export default function App() {
  const canvasRef = useRef(null);
  const inviteInfoRef = useRef(null);
  const framesRef = useRef([]);
  const progressRef = useRef(0);
  const lockedRef = useRef(true);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  useEffect(() => {
    let cancelled = false;
    const frames = [];
    let loaded = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES && !cancelled) {
          framesRef.current = frames;
          setLoading(false);
        }
      };
      frames.push(img);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const frames = framesRef.current;

    canvas.width = frames[0].naturalWidth;
    canvas.height = frames[0].naturalHeight;

    function drawFrame(progress) {
      const index = Math.min(
        Math.floor(progress * TOTAL_FRAMES),
        TOTAL_FRAMES - 1,
      );
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frames[index], 0, 0);
    }

    drawFrame(0);

    let rafId = null;
    function scheduleDraw() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        drawFrame(progressRef.current);
        rafId = null;
      });
    }

    function advance(delta) {
      const next = Math.max(
        0,
        Math.min(1, progressRef.current + delta / SCROLL_DISTANCE),
      );
      progressRef.current = next;
      scheduleDraw();
      return next;
    }

    function handleWheel(e) {
      if (lockedRef.current) {
        e.preventDefault();
        const next = advance(e.deltaY);
        if (next >= 1 && e.deltaY > 0) setLocked(false);
      } else if (inviteInfoRef.current.scrollTop <= 0 && e.deltaY < 0) {
        e.preventDefault();
        setLocked(true);
        advance(e.deltaY);
      }
    }

    let touchStartY = 0;
    function handleTouchStart(e) {
      touchStartY = e.touches[0].clientY;
    }
    function handleTouchMove(e) {
      const currentY = e.touches[0].clientY;
      const delta = touchStartY - currentY;
      touchStartY = currentY;

      if (lockedRef.current) {
        e.preventDefault();
        const next = advance(delta);
        if (next >= 1 && delta > 0) setLocked(false);
      } else if (inviteInfoRef.current.scrollTop <= 0 && delta < 0) {
        e.preventDefault();
        setLocked(true);
        advance(delta);
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [loading]);

  return (
    <>
      {loading && <div className="loading">Loading...</div>}
      <div className={`intro-container${locked ? "" : " hidden"}`}>
        <canvas ref={canvasRef} />
      </div>
      {/* <img className="leftWall" src="/images/leftWall.png" />
      <img className="rightWall" src="/images/rightWall.png" /> */}
      <div className="paperTex">
        <img src="/images/paperTex.png" />
      </div>
      <div className="geoPat">
        <img src="/images/geePaperPattern.png" />
        <img src="/images/geePaperPattern.png" />
        <img src="/images/geePaperPattern.png" />
        <img src="/images/geePaperPattern.png" />

        <img src="/images/geePaperPattern.png" />
      </div>
      <div className="topDecor">
        <img src="/images/TopPat.png" />
      </div>
      <div className="cornerPat">
        <img src="/images/cornerPat2.png" />
        <img src="/images/cornerPat1.png" />
      </div>
      <div className="inviteInfo" ref={inviteInfoRef}>
        <div className="intro infoSection">
          <img className="dua" src="/images/prayer.png" />
          <p>
            We humbly invite you to
            <br /> the wedding of
          </p>
          <div className="BandG">
            <h1>
              Hidayat Mahamadsharif Patil
            </h1>
            <p>&</p>
            <h1>
              Asma Abdul Ibrahim
            </h1>
          </div>
        </div>
        <div className="nikah infoSection">
          <div>
            <p>Nikah Hosted By</p>
            <div className="hosts">
              <h1>
                Brides Fathers Name
              </h1>
              <p>(Bride's Father)</p>
              <h1>
                Brides Mothers Name
              </h1>
              <p>(Bride's Mother)</p>
            </div>
          </div>
          <div>
            <p>Please Join Us On</p>
            <div className="place">
              <h1>July 31st, 2026</h1>
              <hr />
              <h1>8:30 PM</h1>
            </div>
          </div>
          <div>
            <p>Address At</p>
            <div className="address">
              <h1>Concordia space, Alley N, 120th street, Hydrabadh</h1>
              <a>google map link</a>
            </div>
          </div>
        </div>
        <div className="walima infoSection">
          <div>
            <p>Walima Hosted By</p>
            <div className="hosts">
              <h1>Mahamadsharif Babaso Patil</h1>
              <p>(Groom's Father)</p>
              <h1>Shahnaz Mahamadsharif Patil</h1>
              <p>(Groom's Mother)</p>
            </div>
          </div>
          <div>
            <p>Please Join Us On</p>
            <div className="place">
              <h1>August 2nd, 2026</h1>
              <hr />
              <h1>12:00 PM</h1>
            </div>
          </div>
          <div>
            <p>Address At</p>
            <div className="address">
              <h1>Concordia space, Alley N, 120th street, Kolhapur</h1>
              <a>google map link</a>
            </div>
          </div>
        </div>
        <div className="outro infoSection">
          <p>Presents accepted only in blessings.</p>
          <p>We only wish for your presence at the event.</p>
        </div>
      </div>
    </>
  );
}
