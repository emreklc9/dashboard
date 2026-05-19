"use client";

import { useEffect, useRef } from "react";
import styles from "@/styles/login.module.scss";

const LOGIN_VIDEO_SRC =
  process.env.NEXT_PUBLIC_LOGIN_VIDEO?.trim() || "/video/login-video.mp4";

type PlayMode = "forward" | "reverse";

/**
 * Video bitince geri sarar, başa gelince tekrar ileri oynar.
 * `ended` her tarayıcıda güvenilir olmadığı için `timeupdate` da kullanılır.
 */
export default function LoginBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modeRef = useRef<PlayMode>("forward");
  const rafRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lastTick = 0;

    const cancelReverse = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const playForward = () => {
      modeRef.current = "forward";
      cancelReverse();
      video.playbackRate = 1;
      if (Number.isFinite(video.duration) && video.currentTime >= video.duration - 0.05) {
        video.currentTime = 0;
      }
      void video.play().catch(() => {});
    };

    const manualReverse = () => {
      modeRef.current = "reverse";
      cancelReverse();
      video.pause();
      video.playbackRate = 1;

      if (Number.isFinite(video.duration)) {
        video.currentTime = Math.max(0, video.duration - 0.05);
      }

      lastTick = 0;

      const tick = (now: number) => {
        if (modeRef.current !== "reverse") return;

        if (!lastTick) lastTick = now;
        const dt = Math.min((now - lastTick) / 1000, 0.05);
        lastTick = now;

        const next = video.currentTime - dt;
        if (next <= 0.02) {
          video.currentTime = 0;
          playForward();
          return;
        }

        if (typeof video.fastSeek === "function") {
          video.fastSeek(next);
        } else {
          video.currentTime = next;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const tryNativeReverse = () => {
      modeRef.current = "reverse";
      cancelReverse();
      video.pause();

      if (Number.isFinite(video.duration)) {
        video.currentTime = Math.max(0, video.duration - 0.05);
      }

      try {
        video.playbackRate = -1;
      } catch {
        manualReverse();
        return;
      }

      const playPromise = video.play();
      if (!playPromise) {
        manualReverse();
        return;
      }

      playPromise.catch(() => {
        video.playbackRate = 1;
        manualReverse();
      });

      // Chrome playbackRate=-1 desteklemez; 150ms sonra hâlâ ileri gidiyorsa manuel sar
      window.setTimeout(() => {
        if (
          modeRef.current === "reverse" &&
          video.playbackRate >= 0 &&
          rafRef.current === 0
        ) {
          manualReverse();
        }
      }, 150);
    };

    const startReverse = () => {
      if (modeRef.current === "reverse") return;
      tryNativeReverse();
    };

    const onEnded = () => {
      if (modeRef.current === "forward") startReverse();
    };

    const onTimeUpdate = () => {
      if (modeRef.current !== "forward" || !Number.isFinite(video.duration)) return;
      if (video.currentTime >= video.duration - 0.2) {
        startReverse();
      }
    };

    const onNativeReverseTick = () => {
      if (modeRef.current !== "reverse" || video.playbackRate >= 0) return;
      if (video.currentTime <= 0.05) {
        video.pause();
        video.playbackRate = 1;
        video.currentTime = 0;
        playForward();
      }
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("timeupdate", onNativeReverseTick);

    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("timeupdate", onNativeReverseTick);
      cancelReverse();
    };
  }, []);

  return (
    <div className={styles.videoWrap} aria-hidden>
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src={LOGIN_VIDEO_SRC} type="video/mp4" />
      </video>
      <div className={styles.videoOverlay} />
    </div>
  );
}
