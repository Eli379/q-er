import React, { useEffect, useState } from 'react';

type TypingAnimationProps = {
  words: string[];
  speed: number;
};

const TypingAnimation: React.FC<TypingAnimationProps> = ({ words, speed }) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const animateText = () => {
      const currentWord = words[wordIndex];
      const currentText = text;
      const textLength = currentText.length;
      const wordLength = currentWord.length;

      if (isDeleting) {
        setText(currentText.slice(0, textLength - 1));
      } else {
        setText(currentWord.slice(0, textLength + 1));
      }

      if (!isDeleting && textLength === wordLength) {
        setTimeout(() => setIsDeleting(true), speed);
      } else if (isDeleting && textLength === 0) {
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsDeleting(false);
      }

      const delay = isDeleting ? speed / 2 : speed;
      setTimeout(animateText, delay);
    };

    const animationFrameId = requestAnimationFrame(animateText);
    return () => cancelAnimationFrame(animationFrameId);
  }, [text, wordIndex, isDeleting, words, speed]);

  return <span>{text}</span>;
};

export default TypingAnimation;
