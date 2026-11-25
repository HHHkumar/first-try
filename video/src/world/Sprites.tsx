import { useMemo } from 'react';
import * as THREE from 'three';

// Everything in the wire is drawn as camera-facing quads shaded in the fragment
// shader: lit spheres for the ions, soft additive light for the electrons. With
// no GPU on the render machine this is far cheaper than real geometry plus a
// bloom pass, and it gives depth of field for free (each quad knows its depth).

export type SpriteData = {
  capacity: number;
  count: number;
  pos: Float32Array;
  size: Float32Array;
  color: Float32Array;
  alpha: Float32Array;
};

export const makeSprites = (capacity: number): SpriteData => ({
  capacity,
  count: 0,
  pos: new Float32Array(capacity * 3),
  size: new Float32Array(capacity),
  color: new Float32Array(capacity * 3),
  alpha: new Float32Array(capacity),
});

export const pushSprite = (
  d: SpriteData,
  x: number,
  y: number,
  z: number,
  size: number,
  r: number,
  g: number,
  b: number,
  alpha: number,
) => {
  const i = d.count;
  if (i >= d.capacity) return;
  d.pos[i * 3] = x;
  d.pos[i * 3 + 1] = y;
  d.pos[i * 3 + 2] = z;
  d.size[i] = size;
  d.color[i * 3] = r;
  d.color[i * 3 + 1] = g;
  d.color[i * 3 + 2] = b;
  d.alpha[i] = alpha;
  d.count = i + 1;
};

const VERT = /* glsl */ `
attribute vec3 iPos;
attribute float iSize;
attribute vec3 iColor;
attribute float iAlpha;
uniform float uFocus;
uniform float uDof;
uniform float uGrow;
uniform float uFog;
varying vec2 vUv;
varying vec3 vColor;
varying float vAlpha;
varying float vCoc;
varying float vFog;
void main() {
  vec4 mv = viewMatrix * vec4(iPos, 1.0);
  float depth = -mv.z;
  vCoc = clamp(abs(depth - uFocus) * uDof, 0.0, 1.0);
  float s = iSize * (1.0 + vCoc * uGrow);
  mv.xy += position.xy * s;
  gl_Position = projectionMatrix * mv;
  vUv = position.xy * 2.0;
  vColor = iColor;
  vAlpha = iAlpha;
  vFog = exp(-uFog * max(depth, 0.0)) * smoothstep(0.5, 2.6, depth);
}
`;

// Soft additive light: a hot core with a wide skirt.
const FRAG_GLOW = /* glsl */ `
uniform float uGrow;
varying vec2 vUv;
varying vec3 vColor;
varying float vAlpha;
varying float vCoc;
varying float vFog;
void main() {
  float r = length(vUv);
  if (r > 1.0) discard;
  float g = exp(-r * r * 7.0) + 0.30 * pow(1.0 - r, 3.0);
  float energy = 1.0 / (1.0 + vCoc * uGrow);
  gl_FragColor = vec4(vColor, g * vAlpha * vFog * energy);
}
`;

// A lit sphere with a halo, in one quad. The sphere fills the inner 1/HALO of
// the quad; the rest carries the glow. Output is premultiplied so the opaque
// body and the additive halo composite in a single back-to-front pass.
const HALO = '2.6';
const FRAG_ORB = /* glsl */ `
uniform vec3 uDeep;
uniform float uHalo;
varying vec2 vUv;
varying vec3 vColor;
varying float vAlpha;
varying float vCoc;
varying float vFog;
void main() {
  float rq = length(vUv);
  if (rq > 1.0) discard;
  float r = rq * ${HALO};
  float edge = mix(0.05, 0.98, vCoc);
  float body = 1.0 - smoothstep(1.0 - edge, 1.0 + edge * 0.5, r);
  float z = sqrt(max(0.0, 1.0 - min(r * r, 1.0)));
  vec3 n = vec3(vUv * ${HALO}, z);
  vec3 L = normalize(vec3(-0.5, 0.62, 0.6));
  float diff = max(dot(n, L), 0.0);
  float rim = pow(1.0 - z, 2.2);
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 22.0);
  float cool = pow(max(dot(n, normalize(vec3(0.7, -0.45, 0.25))), 0.0), 3.0);
  vec3 lit = mix(uDeep, vColor, 0.06 + 0.94 * diff * diff) + vColor * rim * 0.7 + vec3(1.0, 0.93, 0.82) * spec * 0.6 + vec3(0.18, 0.42, 1.0) * cool * 0.4;
  vec3 flat_ = vColor * 0.75;
  vec3 col = mix(lit, flat_, vCoc);
  float bodyA = body * mix(1.0, 0.13, sqrt(vCoc)) * vAlpha * vFog;
  float halo = exp(-max(r - 0.9, 0.0) * 2.6) * (1.0 - smoothstep(0.5, 1.0, rq));
  float haloA = halo * uHalo * vAlpha * vFog * mix(1.0, 0.15, sqrt(vCoc));
  gl_FragColor = vec4(col * bodyA + vColor * haloA * (1.0 - body), bodyA);
}
`;

export type SpriteKind = 'glow' | 'orb';

type Props = {
  data: SpriteData;
  version: number; // changes whenever the buffers were refilled
  kind: SpriteKind;
  focus: number;
  dof: number;
  grow: number;
  fog: number;
  deep?: [number, number, number];
  halo?: number;
  renderOrder: number;
};

export const Sprites = ({ data, version, kind, focus, dof, grow, fog, deep, halo, renderOrder }: Props) => {
  const geometry = useMemo(() => {
    const g = new THREE.InstancedBufferGeometry();
    g.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0]), 3),
    );
    g.setIndex([0, 1, 2, 0, 2, 3]);
    const attr = (name: string, array: Float32Array, n: number) => {
      const a = new THREE.InstancedBufferAttribute(array, n);
      a.setUsage(THREE.DynamicDrawUsage);
      g.setAttribute(name, a);
    };
    attr('iPos', data.pos, 3);
    attr('iSize', data.size, 1);
    attr('iColor', data.color, 3);
    attr('iAlpha', data.alpha, 1);
    return g;
  }, [data]);

  const material = useMemo(() => {
    const common = {
      vertexShader: VERT,
      uniforms: {
        uFocus: { value: 10 },
        uDof: { value: 0 },
        uGrow: { value: 0 },
        uFog: { value: 0 },
        uDeep: { value: new THREE.Vector3(0.3, 0.1, 0.03) },
        uHalo: { value: 0.2 },
      },
    };
    if (kind === 'glow') {
      return new THREE.ShaderMaterial({
        ...common,
        fragmentShader: FRAG_GLOW,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
      });
    }
    return new THREE.ShaderMaterial({
        ...common,
        fragmentShader: FRAG_ORB,
        transparent: true,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
        depthWrite: false,
        depthTest: false,
      });
  }, [kind]);

  // Refill happens outside; here we only hand the new numbers to the GPU.
  useMemo(() => {
    geometry.instanceCount = data.count;
    for (const name of ['iPos', 'iSize', 'iColor', 'iAlpha']) {
      (geometry.getAttribute(name) as THREE.InstancedBufferAttribute).needsUpdate = true;
    }
  }, [geometry, data, version]);

  material.uniforms.uFocus.value = focus;
  material.uniforms.uDof.value = dof;
  material.uniforms.uGrow.value = grow;
  material.uniforms.uFog.value = fog;
  material.uniforms.uHalo.value = halo ?? 0.2;
  if (deep) material.uniforms.uDeep.value.set(deep[0], deep[1], deep[2]);

  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={renderOrder} />;
};
