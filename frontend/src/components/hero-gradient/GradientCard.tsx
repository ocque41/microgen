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

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st * frequency);
      st *= 2.0;
      amplitude *= 0.55;
    }

    return value;
  }

  void main() {
    vec3 baseGradient = mix(uColorTop, uColorBottom, smoothstep(0.05, 0.95, vUv.y));
    vec3 accentGradient = mix(baseGradient, uColorAccent, smoothstep(0.0, 1.0, vUv.x));

    vec2 animatedUv = vUv * uNoiseScale;
    animatedUv.x += uTime * 0.15;
    animatedUv.y -= uTime * 0.07;

    float grain = fbm(animatedUv * 1.2);
    float glow = fbm(vec2(animatedUv.y, animatedUv.x) * 0.65 + uTime * 0.12);

    vec3 color = mix(baseGradient, accentGradient, uAccentStrength);
    color += (grain - 0.5) * uNoiseIntensity;
    color += 0.28 * glow * uNoiseIntensity;

    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;
// Plan Step 2: retuned shader offsets for heightened turbulence.

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
  top: "#f9f9f9",
  bottom: "#090909",
  accent: "#3a7ca5",
};

const DEFAULT_NOISE: Required<NoiseSettings> = {
  scale: 6.8,
  intensity: 0.32,
  accentStrength: 0.62,
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
        uniforms.uTime.value += delta * 3.1;
        // Plan Step 2: further increased shader timeline speed for aggressive animation.
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
              "linear-gradient(120deg, rgba(249,249,249,0.9) 0%, rgba(58,124,165,0.85) 55%, rgba(9,9,9,0.9) 100%)",
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,240,190,0.35),transparent_55%),radial-gradient(circle_at_80%_110%,rgba(255,155,0,0.4),transparent_60%)]" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export type { GradientCardProps };
