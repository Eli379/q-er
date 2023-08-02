'use client'
import React from 'react';
import TypingAnimation from './components/TypingAnimation';

const words = [
  'Hi i like HTML',
  'I also like css',
  'Lorem ipsum dolor sit amet',
  'consectetur adipiscing elit',
  'sed do eiusmod tempor incididunt'
];

const Home: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <h1 className="relative text-6xl">
          {/* <TypingAnimation words={words} speed={1} /> */}
          {'Q[er]'}
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:text-left">
        <a href="/board" rel="noopener noreferrer">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Check it here{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p>
        </a>
      </div>
    </main>
  );
};

export default Home;
