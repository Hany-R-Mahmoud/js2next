import { ImageResponse } from 'next/og';

export const alt = 'JS2Next: learn JavaScript, React, and Next.js as one connected path';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: '#101820', color: '#f7f3ea', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '72px', width: '100%' }}>
      <div style={{ color: '#43d6c8', display: 'flex', fontSize: 30, fontWeight: 700 }}>JS2Next</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, letterSpacing: -2 }}>From JavaScript to Next.js.</div>
        <div style={{ color: '#c7d0d5', display: 'flex', fontSize: 30 }}>Learn the layer in between.</div>
      </div>
      <div style={{ color: '#ff6b4a', display: 'flex', fontSize: 24 }}>JavaScript · React · Next.js</div>
    </div>,
    { ...size },
  );
}
