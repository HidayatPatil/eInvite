import { useEffect, useRef, useState } from "react";
import "./App.css";

const TOTAL_FRAMES = 93;

function framePath(i) {
  return `/video_frames_webp/web_video_${String(i).padStart(5, "0")}.webp`;
}

export default function App() {
  const canvasRef = useRef(null);
  const spacerRef = useRef(null);
  const inviteInfoRef = useRef(null);
  const framesRef = useRef([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    if (inviteInfoRef.current) inviteInfoRef.current.scrollTop = 0;
  }, []);

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

    function drawFrame(index) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frames[index], 0, 0);
    }

    drawFrame(0);

    let rafId = null;
    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const spacerHeight = spacerRef.current.offsetHeight;
        const maxScroll = spacerHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
        const index = Math.min(
          Math.floor(progress * TOTAL_FRAMES),
          TOTAL_FRAMES - 1,
        );
        drawFrame(index);

        // Keep inviteInfo non-interactive to scroll until the canvas has
        // fully scrolled out of view, so wheel input doesn't get captured
        // by its internal scroll while only a sliver is visible.
        inviteInfoRef.current.style.pointerEvents =
          window.scrollY >= spacerHeight ? "auto" : "none";

        rafId = null;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [loading]);

  return (
    <>
      {loading && <div className="loading">Loading...</div>}
      <div className="scroll-spacer" ref={spacerRef}>
        <div className="sticky-container">
          <canvas ref={canvasRef} />
        </div>
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
