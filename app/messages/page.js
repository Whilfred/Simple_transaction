'use client';

import Chat from '@/components/Chat';

export default function PageMessages() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', backgroundColor: '#efeae2' }}>
      <Chat />
    </div>
  );
}
