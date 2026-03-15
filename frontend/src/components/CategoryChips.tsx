import React from 'react';

interface Category {
  id: number;
  nombre: string;
}

interface CategoryChipsProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({ categories, selectedId, onSelect }) => {
  return (
    <div className="d-flex flex-wrap gap-2">
      <button 
        className={`btn rounded-pill px-4 transition-all ${!selectedId ? 'btn-primary' : 'btn-outline-secondary'}`} 
        onClick={() => onSelect(null)}
      >
        Todos
      </button>
      {categories.map(cat => (
        <button 
          key={cat.id} 
          className={`btn rounded-pill px-3 transition-all ${selectedId === cat.id ? 'btn-primary' : 'btn-outline-secondary'}`} 
          onClick={() => onSelect(cat.id)}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  );
};

export default CategoryChips;
