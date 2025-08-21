'use client';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const difficultyLevels = ['Easy', 'Intermediate', 'Advanced'];

const FilterModal = ({ isOpen, onClose, onApplyFilters, availableTechStacks, activeFilters }) => {
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [techFilterMode, setTechFilterMode] = useState('AND');

  useEffect(() => {
    if (isOpen) {
      setSelectedTechs(activeFilters.techStacks || []);
      setSelectedDifficulty(activeFilters.difficulty || null);
      setTechFilterMode(activeFilters.techFilterMode || 'AND');
    }
  }, [isOpen, activeFilters]);

  const handleTechChange = (tech) => {
    setSelectedTechs(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleApply = () => {
    onApplyFilters({
      techStacks: selectedTechs,
      difficulty: selectedDifficulty,
      techFilterMode: techFilterMode
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedTechs([]);
    setSelectedDifficulty(null);
    setTechFilterMode('AND');
    onApplyFilters({ techStacks: [], difficulty: null, techFilterMode: 'AND' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-[100] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content w-full max-w-md bg-[#1A1D24]/80 backdrop-blur-md border border-[var(--border-color)] rounded-lg shadow-xl p-6 relative flex flex-col max-h-[80vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--text-medium)] hover:text-[var(--text-light)]"
          aria-label="Close filter modal"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-[var(--text-light)] mb-4 flex-shrink-0">Filter Projects</h2>

        <div className="flex-grow overflow-y-auto pr-2 mb-4">

          <div className="mb-6">
            <h3 className="text-lg font-medium text-[var(--text-light)] mb-3">By Difficulty</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value="all"
                  checked={selectedDifficulty === null}
                  onChange={() => handleDifficultyChange(null)}
                  className="form-radio h-5 w-5 bg-[var(--border-color)] border-[var(--border-color)] text-[var(--accent-blue)] focus:ring-[var(--accent-blue)] focus:ring-offset-0"
                />
                <span className="text-[var(--text-light)]">All Difficulties</span>
              </label>
              {difficultyLevels.map(level => (
                <label key={level} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty"
                    value={level}
                    checked={selectedDifficulty === level}
                    onChange={() => handleDifficultyChange(level)}
                    className="form-radio h-5 w-5 bg-[var(--border-color)] border-[var(--border-color)] text-[var(--accent-blue)] focus:ring-[var(--accent-blue)] focus:ring-offset-0"
                  />
                  <span className="text-[var(--text-light)]">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-[var(--text-light)]">By Technology</h3>
              <div className="flex border border-[var(--border-color)] rounded-md text-xs">
                <button
                  onClick={() => setTechFilterMode('AND')}
                  className={`px-2 py-1 rounded-l-md ${techFilterMode === 'AND' ? 'bg-[var(--accent-blue)] text-[#1A1D24]' : 'bg-transparent text-[var(--text-medium)] hover:bg-[var(--border-color)]'}`}
                >
                  AND
                </button>
                <button
                  onClick={() => setTechFilterMode('OR')}
                  className={`px-2 py-1 rounded-r-md ${techFilterMode === 'OR' ? 'bg-[var(--accent-blue)] text-[#1A1D24]' : 'bg-transparent text-[var(--text-medium)] hover:bg-[var(--border-color)]'}`}
                >
                  OR
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {availableTechStacks.sort().map(tech => (
                <label key={tech} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTechs.includes(tech)}
                    onChange={() => handleTechChange(tech)}
                    className="form-checkbox h-5 w-5 rounded bg-[var(--border-color)] border-[var(--border-color)] text-[var(--accent-blue)] focus:ring-[var(--accent-blue)] focus:ring-offset-0"
                  />
                  <span className="text-[var(--text-light)]">{tech}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-4 mt-auto pt-4 border-t border-[var(--border-color)] flex-shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-medium)] rounded-md hover:bg-[var(--border-color)] hover:text-[var(--text-light)] transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-[var(--accent-blue)] text-[#1A1D24] font-semibold rounded-md hover:opacity-90 transition-opacity"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

FilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  availableTechStacks: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilters: PropTypes.shape({
    techStacks: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.string,
    techFilterMode: PropTypes.oneOf(['AND', 'OR']),
  }).isRequired,
};

export default FilterModal; 