import React from 'react';

// CategorySelector コンポーネントのプロパティの型定義
interface CategorySelectorProps {
  labels: string[];
  currentLabel: string;
  setCurrentLabel: (label: string) => void;
}

// CategorySelector コンポーネントの定義
const CategorySelector: React.FC<CategorySelectorProps> = ({
  labels,
  currentLabel,
  setCurrentLabel,
}) => {
  return (
    <select
      value={currentLabel}
      onChange={(e) => setCurrentLabel(e.target.value)}
      className="c-select"
    >
      {labels.map((label) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default CategorySelector;
