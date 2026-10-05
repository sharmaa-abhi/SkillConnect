import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide' | 'modal';
}

export function Container({
  children,
  className = '',
  size = 'default',
}: ContainerProps) {
  const maxWidth = {
    narrow: 'max-w-md', // 480px for auth forms
    modal: 'max-w-lg', // 560px for booking dialogs
    default: 'max-w-7xl', // 1280px standard container
    wide: 'max-w-screen-2xl',
  }[size];

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${maxWidth} ${className}`}>
      {children}
    </div>
  );
}
