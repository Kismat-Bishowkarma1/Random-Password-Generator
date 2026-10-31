import React, { useState, useEffect, useCallback } from 'react';
import { TiTick } from "react-icons/ti";


const App = () => {
  // State
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(14);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    avoidRepeating: false,
  });
  const [copied, setCopied] = useState(false);

  // Character sets
  const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
  };

  const SIMILAR_CHARS = 'il1Lo0O';

  // Generate Password Logic
  const generatePassword = useCallback(() => {
    let availableChars = '';
    if (options.uppercase) availableChars += CHAR_SETS.uppercase;
    if (options.lowercase) availableChars += CHAR_SETS.lowercase;
    if (options.numbers) availableChars += CHAR_SETS.numbers;
    if (options.symbols) availableChars += CHAR_SETS.symbols;

    if (options.excludeSimilar) {
      availableChars = availableChars
        .split('')
        .filter((char) => !SIMILAR_CHARS.includes(char))
        .join('');
    }

    if (!availableChars) {
      setPassword('');
      return;
    }

    let newPassword = '';
    let lastChar = '';

    for (let i = 0; i < length; i++) {
      let randomChar;
      do {
        randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
      } while (options.avoidRepeating && randomChar === lastChar);

      newPassword += randomChar;
      lastChar = randomChar;
    }

    setPassword(newPassword);
  }, [length, options]);

  // Generate initial password on load
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Copy to clipboard
  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Checkbox Changes
  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setOptions((prev) => ({ ...prev, [name]: checked }));
  };

  // Calculate Password Strength
  const getStrength = () => {
    let score = length;
    if (options.uppercase) score += 10;
    if (options.lowercase) score += 10;
    if (options.numbers) score += 10;
    if (options.symbols) score += 15;

    if (score < 35) return { text: 'Weak', color: 'bg-rose-500', width: '33%' };
    if (score < 55) return { text: 'Medium', color: 'bg-amber-500', width: '66%' };
    return { text: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 font-sans text-zinc-300">
      <div className="w-full max-w-md bg-[#18181b] rounded-2xl p-6 shadow-2xl border border-zinc-800">
        
        {/* Header */}
        <h1 className="text-xl font-bold text-white text-center mb-1">Random Password Generator</h1>
        <p className="text-sm text-zinc-400 text-center mb-6">Create strong passwords with custom rules.</p>

        {/* Output Section */}
        <div className="relative mb-5">
          <input
            type="text"
            readOnly
            value={password}
            placeholder="Your password will appear here"
            className="w-full bg-[#09090b] text-white px-4 py-3.5 pr-24 rounded-lg border border-zinc-800 focus:outline-none focus:border-violet-500 text-lg tracking-wider placeholder:text-zinc-600 placeholder:text-base transition-colors"
          />
          <button
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#27272a] hover:bg-zinc-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-zinc-700"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Strength Indicator */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-zinc-400">Password Strength</span>
            <span className={`font-medium ${strength.text === 'Weak' ? 'text-rose-500' : strength.text === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
              {strength.text}
            </span>
          </div>
          <div className="h-2 w-full bg-[#27272a] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
              style={{ width: strength.width }}
            ></div>
          </div>
        </div>

        {/* Length Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-zinc-400">Password Length</span>
            <span className="text-white font-medium">{length}</span>
          </div>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          
          {/* Checkbox Component */}
          {[
            { id: 'uppercase', label: 'Uppercase Letters' },
            { id: 'lowercase', label: 'Lowercase Letters' },
            { id: 'numbers', label: 'Numbers' },
            { id: 'symbols', label: 'Symbols' },
            { id: 'excludeSimilar', label: 'Exclude Similar Characters' },
            { id: 'avoidRepeating', label: 'Avoid Repeating Characters' },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 bg-[#09090b] border border-zinc-800 p-3 rounded-lg cursor-pointer hover:border-zinc-600 transition-colors group relative"
            >
              <div className="relative flex items-center justify-center z-10">
                <input
                  type="checkbox"
                  name={item.id}
                  checked={options[item.id]}
                  onChange={handleOptionChange}
                  className="peer sr-only"
                />

                {/* The Box */}
                <div className="w-5 h-5 border-2 border-zinc-600 rounded bg-transparent  transition-all"></div>

                {/* Overflowing Green Tick */}
                <TiTick
                  className="absolute w-10 h-10 pl-2 text-[#84cc16] opacity-0 peer-checked:opacity-100 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 z-20"
                />
              </div>
              
              <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                {item.label}
              </span>
            </label>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20 active:scale-[0.98]"
        >
          Generate Password
        </button>
        
      </div>
    </div>
  );
};

export default App;