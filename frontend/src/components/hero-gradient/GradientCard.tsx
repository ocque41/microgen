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

  float pulse(float value, float center, float width) {
    return smoothstep(center - width, center, value) - smoothstep(center, center + width, value);
  }

  void main() {
    vec3 baseGradient = mix(uColorTop, uColorBottom, smoothstep(0.04, 0.96, vUv.y));

    float diagonal = fract((vUv.x + vUv.y) * (10.0 + uNoiseScale * 0.55) + uTime * 2.8);
    float diagonalPulse = pulse(diagonal, 0.5, 0.06);

    float vertical = fract(vUv.x * (4.0 + uNoiseScale * 0.35) - uTime * 1.8);
    float verticalPulse = pulse(vertical, 0.26, 0.05);

    float sweepWave = sin(uTime * 5.6 + vUv.y * (14.0 + uNoiseScale));
    float sweep = smoothstep(0.15, 0.95, sweepWave);

    float horizon = smoothstep(0.12, 0.82, vUv.y + sin(uTime * 0.9) * 0.05);

    float energy = clamp(diagonalPulse * 0.55 + verticalPulse * 0.4 + sweep * 0.35 + horizon * 0.2, 0.0, 1.0);
    energy = pow(energy, 1.12);

    vec3 accentLayer = mix(baseGradient, uColorAccent, energy * uNoiseIntensity);
    vec3 color = mix(baseGradient, accentLayer, uAccentStrength);
    color = mix(color, vec3(1.0), 0.03 * energy);

    gl_FragColor = vec4(color, 1.0);
  }
`;
// Plan Step 3: refreshed shader with minimal pulses inspired by interfaces.rauno aesthetic.

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
  top: "#2f2d28",
  bottom: "#090909",
  accent: "#e8cca3",
};

const DEFAULT_NOISE: Required<NoiseSettings> = {
  scale: 7.5,
  intensity: 0.82,
  accentStrength: 0.74,
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
              "linear-gradient(115deg, rgba(36,36,35,0.94) 0%, rgba(0,145,173,0.78) 55%, rgba(9,9,9,0.98) 100%)",
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_-14%,rgba(0,93,112,0.32),transparent_58%),radial-gradient(circle_at_84%_116%,rgba(0,145,173,0.36),transparent_62%)]" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export type { GradientCardProps };
