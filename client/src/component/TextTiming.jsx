import React, { useState, useEffect } from 'react';

const TextTiming = ({ texts=[], speed = 150,pauseDuration = 5000 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [index, setIndex] = useState(0);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
    useEffect(() => {
        if (texts.length === 0) return;

        const currentText = texts[currentTextIndex];

        const typingInterval = setInterval(() => {
            if (!isDeleting) {
              if (index < currentText.length) {
                setDisplayedText((prev) => prev + currentText.charAt(index));
                setIndex((prev) => prev + 1);
              } else {
                // Pause before deleting
                // setIsDeleting(true);
                clearInterval(typingInterval);
                setTimeout(() => setIsDeleting(true), pauseDuration);
              }
            } else {
              if (index > 0) {
                setDisplayedText((prev) => prev.slice(0, -1));
                setIndex((prev) => prev - 1);
              } else {
                // Start typing again after deleting
                clearInterval(typingInterval);
                setCurrentTextIndex((prev) => (prev + 1) % texts.length); // Move to the next text
                setIsDeleting(false)
                setIndex(0); // Reset index for the next text
                setDisplayedText(''); // Clear displayed text for next iteration
               
              }
            }
          }, isDeleting ? speed / 2 : speed); // Speed up the deleting process
      
          return () => clearInterval(typingInterval); // Cleanup on unmount
        }, [isDeleting, index,  texts, speed, pauseDuration ,currentTextIndex]);
  
    return (
        <div >
           <div> <h1 className="text-5xl font-bold mb-4">What Do You Want To Do</h1> </div>
        <div className="text-4xl font-mono shadow-lg font-semibold bg-gray-800 text-white p-4 rounded-lg w-auto">
        {displayedText}
        <span className="animate-blink">|</span>
      </div>
      </div>
  
    )
  };  

  export default TextTiming