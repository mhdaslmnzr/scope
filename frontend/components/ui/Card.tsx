// frontend/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

const Card = ({ children, className = '', header, footer, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 transition-shadow ${onClick ? 'hover:shadow-md cursor-pointer' : ''} ${className}`}
    >
      {header && <div className="mb-4">{header}</div>}
      <div>{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default Card;
