import React, { useState, useEffect, useRef } from 'react';
import { TrashIcon, PencilIcon, CogIcon, ReplyIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';

type QueueBoardProps = {};

const QueueBoard: React.FC<QueueBoardProps> = () => {
  const [queue, setQueue] = useState<string[]>([]);
  const [username, setUsername] = useState<string>('');
  const [editedUsername, setEditedUsername] = useState<string>('');
  const [editedIndex, setEditedIndex] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [history, setHistory] = useState<string[][]>([]);
  const historyIndexRef = useRef<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedQueue = sessionStorage.getItem('queue');
    if (storedQueue) {
      setQueue(JSON.parse(storedQueue));
    }

    const storedHistory = sessionStorage.getItem('history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('queue', JSON.stringify(queue));
    sessionStorage.setItem('history', JSON.stringify(history));
  }, [queue, history]);

  const handleAddToQueue = () => {
    if (username.trim() !== '') {
      // Check if the username already exists in the queue
      const isDuplicate = queue.includes(username);
      let newUsername = username;

      if (isDuplicate) {
        let i = 1;
        // Keep adding "(i)" to the username until it becomes unique
        while (queue.includes(`${username} (${i})`)) {
          i++;
        }
        newUsername = `${username} (${i})`;
      }

      setQueue((prevQueue) => [...prevQueue, newUsername]);
      setUsername('');
      setHistory([]);
    }
  };

  const handleRemoveFromQueue = (index: number) => {
    if (queue[index]) {
      const deletedUser = queue[index];
      setQueue((prevQueue) => prevQueue.filter((_, i) => i !== index));
  
      const updatedHistory = [...history];
      updatedHistory.push([deletedUser]); // Store the deletedUser in an array to add to history
      setHistory(updatedHistory);
  
      historyIndexRef.current = history.length;
      setUsername('');
      setEditedUsername('');
      setEditedIndex(null);
  
      // Delay the sessionStorage update to ensure the UI transitions are complete
      setTimeout(() => {
        sessionStorage.setItem('queue', JSON.stringify(queue));
        sessionStorage.setItem('history', JSON.stringify(updatedHistory));
      }, 300);
    }
  };
  
  
  const handleUndo = () => {
    if (history.length > 0 && historyIndexRef.current !== null) {
      // Retrieve the most recent slot from history and add it back to the queue
      const recentSlot = history[historyIndexRef.current][0];
  
      // Get the original index where the user was deleted
      const deletedIndex = historyIndexRef.current;
  
      // Insert the user at the correct index
      setQueue((prevQueue) => {
        const newQueue = [...prevQueue];
        newQueue.splice(deletedIndex, 0, recentSlot);
        return newQueue;
      });
  
      // Remove the last element from history as we are undoing it
      setHistory((prevHistory) => prevHistory.slice(0, historyIndexRef.current));
  
      setUsername('');
      setEditedUsername('');
      setEditedIndex(null);
    }
  };
  
  

  const handleEdit = (index: number) => {
    setEditedIndex(index);
    setEditedUsername(queue[index]);
  };

  const handleSaveEdit = () => {
    if (editedIndex !== null && editedUsername.trim() !== '') {
      setQueue((prevQueue) =>
        prevQueue.map((user, index) => (index === editedIndex ? editedUsername : user))
      );
      setEditedUsername('');
      setEditedIndex(null);
      setHistory([]);
    }
  };

  const handleCancelEdit = () => {
    setEditedUsername('');
    setEditedIndex(null);
  };

  const handleToggleAdmin = () => {
    setIsAdmin((prevIsAdmin) => !prevIsAdmin);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node) &&
      editedIndex !== null
    ) {
      handleSaveEdit();
    }
  };

  useEffect(() => {
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    const colorSchemeChangeHandler = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', colorSchemeChangeHandler);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', colorSchemeChangeHandler);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [editedIndex]);

  const getTotalSlots = 20;
  const totalSlotsArr = Array.from({ length: getTotalSlots });

  return (
    <div className={`p-4 flex flex-col ${isDarkMode ? 'dark' : 'light'}`} ref={containerRef}>
      <div className="flex flex-row">
        <div className="basis-3/4 text-2xl font-semibold mb-4">Queue Board</div>
        <div className="flex flex-1 px-4 py-2">
          {history.length > 0 && (
            <motion.button
              onClick={handleUndo}
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: '0%' }}
              exit={{ opacity: 0, x: '-50%' }}
              transition={{ duration: 0.2 }}
              className={`items-center bg-transparent focus:outline-none rounded transform hover:scale-110 transition-all ${
                isDarkMode ? 'filter brightness-125' : 'filter brightness-90'
              }`}
            >
              <ReplyIcon className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
            </motion.button>
          )}
        </div>
        <motion.button
          onClick={handleToggleAdmin}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`px-4 py-2 rounded flex-1 ${
            isAdmin ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          } focus:outline-none`}
        >
          <CogIcon className="w-5 h-5" />
        </motion.button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <AnimatePresence>
            {totalSlotsArr.slice(0, 10).map((_, index) => {
              const slotNumber = index + 1;
              const userIndex = slotNumber - 1;
              const user = queue[userIndex];
              const isEditing = editedIndex === userIndex;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 1, x: '0%' }}
                  animate={{ opacity: 1, x: '0%' }}
                  exit={{ opacity: 0, x: '-100%' }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2"
                >
                  <div className="font-semibold">{slotNumber}.</div>
                  {!isEditing && <span className="flex-grow">{user || (isAdmin ? '' : '')}</span>}
                  {isEditing && (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit();
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      className={`flex-grow p-1 border border-gray-300 rounded-sm focus:outline-none ${
                        isDarkMode ? 'bg-white text-black' : 'bg-white text-black'
                      }`}
                    />
                  )}
                  {isAdmin && user && !isEditing && (
                    <motion.button
                      onClick={() => handleEdit(userIndex)}
                      initial={{ x: '100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: '100%', opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center bg-transparent focus:outline-none rounded transform hover:scale-110 transition-all ${
                        isDarkMode ? 'filter brightness-125' : 'filter brightness-90'
                      }`}
                    >
                      <PencilIcon className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                    </motion.button>
                  )}
                  {isAdmin && user && !isEditing && (
                    <motion.button
                      onClick={() => handleRemoveFromQueue(userIndex)}
                      initial={{ x: '100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: '100%', opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center bg-transparent focus:outline-none rounded transform hover:scale-110 transition-all ${
                        isDarkMode ? 'filter brightness-125' : 'filter brightness-90'
                      }`}
                    >
                      <TrashIcon className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex flex-col space-y-2">
          <AnimatePresence>
            {totalSlotsArr.slice(10, 20).map((_, index) => {
              const slotNumber = index + 11;
              const userIndex = slotNumber - 1;
              const user = queue[userIndex];
              const isEditing = editedIndex === userIndex;

              return (
                <motion.div
                  key={index + 10}
                  initial={{ opacity: 1, x: '0%' }}
                  animate={{ opacity: 1, x: '0%' }}
                  exit={{ opacity: 0, x: '-100%' }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2"
                >
                  <div className="font-semibold">{slotNumber}.</div>
                  {!isEditing && <span className="flex-grow">{user || (isAdmin ? '' : '')}</span>}
                  {isEditing && (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit();
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      className={`flex-grow p-1 border border-gray-300 rounded-sm focus:outline-none ${
                        isDarkMode ? 'bg-white text-black' : 'bg-white text-black'
                      }`}
                    />
                  )}
                  {isAdmin && user && !isEditing && (
                    <motion.button
                      onClick={() => handleEdit(userIndex)}
                      initial={{ x: '100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: '100%', opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center bg-transparent focus:outline-none rounded transform hover:scale-110 transition-all ${
                        isDarkMode ? 'filter brightness-125' : 'filter brightness-90'
                      }`}
                    >
                      <PencilIcon className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                    </motion.button>
                  )}
                  {isAdmin && user && !isEditing && (
                    <motion.button
                      onClick={() => handleRemoveFromQueue(userIndex)}
                      initial={{ x: '100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: '100%', opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center bg-transparent focus:outline-none rounded transform hover:scale-110 transition-all ${
                        isDarkMode ? 'filter brightness-125' : 'filter brightness-90'
                      }`}
                    >
                      <TrashIcon className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter name here"
            className={`flex-1 p-2 border border-gray-300 rounded ${
              isDarkMode ? 'bg-white text-black' : 'bg-white text-black'
            }`}
          />
          <button
            onClick={handleAddToQueue}
            className={`px-4 py-2 ${
              isDarkMode ? 'bg-white text-black' : 'bg-blue-500 text-white'
            } rounded focus:outline-none`}
          >
            Add me to the queue
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueBoard;
