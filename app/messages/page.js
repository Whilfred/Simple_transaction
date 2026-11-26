'use client';

import Chat from '@/components/Chat';

export default function PageMessages() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Messagerie</h1>
      <Chat />
    </div>
  );
}
