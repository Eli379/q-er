'use client'
import React from 'react';
import QueueBoard from '../components/QueueBoard';

const Home: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Other components or content */}
      <QueueBoard />
    </main>
  );
};

export default Home;