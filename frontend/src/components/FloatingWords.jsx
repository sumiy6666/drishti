import React from 'react';

const words = [
    { text: 'Startup', top: '10%', left: '10%', delay: '0s' },
    { text: 'Remote', top: '20%', left: '80%', delay: '2s' },
    { text: 'Engineering', top: '70%', left: '15%', delay: '4s' },
    { text: 'Design', top: '60%', left: '75%', delay: '1s' },
    { text: 'Product', top: '15%', left: '60%', delay: '3s', hiddenOnMobile: true },
    { text: 'Sales', top: '80%', left: '60%', delay: '5s', hiddenOnMobile: true },
    { text: 'SaaS', top: '50%', left: '35%', delay: '5.5s', hiddenOnMobile: true },
    { text: 'DevOps', top: '50%', left: '45%', delay: '5s', hiddenOnMobile: true },
    { text: 'AI', top: '50%', left: '55%', delay: '6.5s' },
    { text: 'Blockchain', top: '50%', left: '65%', delay: '3.5s', hiddenOnMobile: true },
    { text: 'HR', top: '50%', left: '75%', delay: '2.5s' },
    { text: 'Cybersecurity', top: '50%', left: '15%', delay: '6s', hiddenOnMobile: true },
];

const FloatingWords = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {words.map((word, index) => (
                <div
                    key={index}
                    className={`absolute text-gray-400/30 font-bold animate-float hover:text-blue-400 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer pointer-events-auto
                        text-sm md:text-2xl
                        ${word.hiddenOnMobile ? 'hidden md:block' : 'block'}
                    `}
                    style={{
                        top: word.top,
                        left: word.left,
                        animationDelay: word.delay,
                    }}
                >
                    {word.text}
                </div>
            ))}
        </div>
    );
};

export default FloatingWords;
