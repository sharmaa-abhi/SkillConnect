import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #1A2B3D, #0F1922)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          color: '#00E5BF',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  );
}
