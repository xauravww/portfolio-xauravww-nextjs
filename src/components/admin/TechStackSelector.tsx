'use client';

import { useState, useEffect } from 'react';

interface TechStack {
  id: string;
  name: string;
  category: string;
  icon: string;
  color?: string;
}

interface TechStackSelectorProps {
  selectedTechStacks: string[];
  onChange: (techStacks: string[]) => void;
}

export default function TechStackSelector({ selectedTechStacks, onChange }: TechStackSelectorProps) {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchTechStacks();
  }, []);

  const fetchTechStacks = async () => {
    try {
      const response = await fetch('/api/portfolio/techstacks');
      if (response.ok) {
        const data = await response.json();
        setTechStacks(data);
      }
    } catch (error) {
      console.error('Error fetching tech stacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechStacks = techStacks.filter(stack => {
    const matchesSearch = stack.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || stack.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(techStacks.map(stack => stack.category)))];

  const toggleTechStack = (techStackName: string) => {
    const newSelection = selectedTechStacks.includes(techStackName)
      ? selectedTechStacks.filter(name => name !== techStackName)
      : [...selectedTechStacks, techStackName];
    onChange(newSelection);
  };

  if (loading) {
    return (
      <div className="text-[#A0A0A0] text-center py-4">
        Loading tech stacks...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] transition-all duration-200 placeholder-[#A0A0A0]"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] transition-all duration-200"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Tech Stacks */}
      {selectedTechStacks.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-[#F0F0F0] mb-2">
            Selected ({selectedTechStacks.length}):
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedTechStacks.map(techName => {
              const tech = techStacks.find(t => t.name === techName);
              return (
                <div
                  key={techName}
                  className="flex items-center bg-[#4A90E2]/20 text-[#4A90E2] px-3 py-1 rounded-full text-sm border border-[#4A90E2]/30"
                >
                  {tech?.icon && (
                    <img 
                      src={tech.icon} 
                      alt={techName}
                      className="w-4 h-4 rounded mr-2 object-cover"
                    />
                  )}
                  {techName}
                  <button
                    type="button"
                    onClick={() => toggleTechStack(techName)}
                    className="ml-2 text-[#4A90E2] hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
        {filteredTechStacks.map(stack => {
          const isSelected = selectedTechStacks.includes(stack.name);
          return (
            <button
              key={stack.id}
              type="button"
              onClick={() => toggleTechStack(stack.name)}
              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'border-[#4A90E2] bg-[#4A90E2]/20 text-[#4A90E2]'
                  : 'border-[#33373E] bg-[#33373E]/30 text-[#A0A0A0] hover:border-[#4A90E2]/50 hover:bg-[#4A90E2]/10'
              }`}
            >
              <img 
                src={stack.icon} 
                alt={stack.name}
                className="w-8 h-8 rounded-lg object-cover mb-2"
              />
              <span className="text-xs font-medium text-center leading-tight">
                {stack.name}
              </span>
            </button>
          );
        })}
      </div>

      {filteredTechStacks.length === 0 && (
        <div className="text-center py-8 text-[#A0A0A0]">
          No tech stacks found. Try adjusting your search or filter.
        </div>
      )}
    </div>
  );
}