import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { cn } from "../../lib/utils";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uColorTop;
  uniform vec3 uColorBottom;
  uniform vec3 uColorAccent;
  uniform float uNoiseScale;
  uniform float uNoiseIntensity;
  uniform float uAccentStrength;
  uniform float uTime;

  void main() {
    vec3 baseGradient = mix(uColorTop, uColorBottom, smoothstep(0.05, 0.95, vUv.y));

    float freqX = 12.0 + uNoiseScale * 1.8;
    float freqY = 8.5 + uNoiseScale * 1.2;

    float waveX = sin((vUv.x * freqX) + uTime * 4.2);
    float waveY = cos((vUv.y * freqY) - uTime * 3.4);

    float circuit = smoothstep(0.2, 0.8, 0.5 + 0.5 * waveX);
    float sweep = smoothstep(0.25, 0.75, 0.5 + 0.5 * waveY);

    float streak = abs(sin(((vUv.x + vUv.y) * (20.0 + uNoiseScale * 3.0)) + uTime * 6.0));
    float streakMask = smoothstep(0.55, 0.88, streak);

    float bands = abs(fract((vUv.x + uTime * 0.4) * (6.0 + uNoiseScale * 0.6)) - 0.5);
    float bandMask = smoothstep(0.0, 0.3, bands);

    float highlight = clamp(circuit * 0.45 + sweep * 0.3 + streakMask * 0.6 + bandMask * 0.35, 0.0, 1.0);
    highlight = pow(highlight, 1.35);

    vec3 accentLayer = mix(baseGradient, uColorAccent, highlight * uNoiseIntensity);
    vec3 color = mix(baseGradient, accentLayer, uAccentStrength);

    gl_FragColor = vec4(color, 1.0);
  }
`;
// Plan Step 2: replaced noise-based shader with fast, linear pulses for a cleaner futuristic motion.

type GradientColors = {
  top?: string;
  bottom?: string;
  accent?: string;
};

type NoiseSettings = {
  scale?: number;
  intensity?: number;
  accentStrength?: number;
};

type GradientCardProps = {
  className?: string;
  colors?: GradientColors;
  noise?: NoiseSettings;
  borderRadiusClassName?: string;
  children?: ReactNode;
};

const DEFAULT_COLORS: Required<GradientColors> = {
  top: "#d9dcd6",
  bottom: "#090909",
  accent: "#0091ad",
};

const DEFAULT_NOISE: Required<NoiseSettings> = {
  scale: 6.5,
  intensity: 0.6,
  accentStrength: 0.68,
};

function parseColor(hex: string) {
  const color = new THREE.Color(hex);
  return { r: color.r, g: color.g, b: color.b };
}

type ShaderUniforms = {
  uColorTop: { value: THREE.Vector3 };
  uColorBottom: { value: THREE.Vector3 };
  uColorAccent: { value: THREE.Vector3 };
  uNoiseScale: { value: number };
  uNoiseIntensity: { value: number };
  uAccentStrength: { value: number };
  uTime: { value: number };
};

export function GradientCard({
  className,
  colors,
  noise,
  borderRadiusClassName = "rounded-[5px]",
  children,
}: GradientCardProps) {
  const palette = { ...DEFAULT_COLORS, ...colors };
  const noiseSettings = { ...DEFAULT_NOISE, ...noise };
  const isBrowser = typeof window !== "undefined";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const uniforms = useMemo<ShaderUniforms>(() => {
    const top = parseColor(palette.top);
    const bottom = parseColor(palette.bottom);
    const accent = parseColor(palette.accent);

    return {
      uColorTop: { value: new THREE.Vector3(top.r, top.g, top.b) },
      uColorBottom: { value: new THREE.Vector3(bottom.r, bottom.g, bottom.b) },
      uColorAccent: { value: new THREE.Vector3(accent.r, accent.g, accent.b) },
      uNoiseScale: { value: noiseSettings.scale },
      uNoiseIntensity: { value: noiseSettings.intensity },
      uAccentStrength: { value: noiseSettings.accentStrength },
      uTime: { value: 0 },
    } satisfies ShaderUniforms;
  }, [
    palette.top,
    palette.bottom,
    palette.accent,
    noiseSettings.scale,
    noiseSettings.intensity,
    noiseSettings.accentStrength,
  ]);

  useEffect(() => {
    if (!isBrowser || !containerRef.current || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    camera.position.set(0, 0, 1.8);

    const geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
    // Plan Step 2: expanded plane size to blanket the hero container per refreshed spec.
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(0x000000, 0);

    const updateRendererSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      if (typeof window !== "undefined") {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
      }
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    updateRendererSize();

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateRendererSize)
      : null;
    resizeObserver?.observe(containerRef.current);

    let animationFrameId: number;
    let lastTimestamp: number | null = null;

    const animate = (time: number) => {
      if (lastTimestamp !== null) {
        const delta = (time - lastTimestamp) / 1000;
        uniforms.uTime.value += delta * 3.6;
        // Plan Step 2: escalated timeline speed to keep motion sharp while remaining clean.
      }
      lastTimestamp = time;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      scene.remove(mesh);
    };
  }, [isBrowser, uniforms]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", borderRadiusClassName, className)}
    >
      {isBrowser ? (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(118deg, rgba(217,220,214,0.92) 0%, rgba(0,145,173,0.72) 52%, rgba(9,9,9,0.94) 100%)",
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_-12%,rgba(8,76,97,0.38),transparent_55%),radial-gradient(circle_at_82%_112%,rgba(0,145,173,0.42),transparent_60%)]" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export type { GradientCardProps };
