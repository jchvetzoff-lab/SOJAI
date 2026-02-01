'use client';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  onClick,
}: ButtonProps) {
  const baseClasses = 'btn';

  const variants = {
    primary: 'btn-primary',
    secondary: 'bg-white text-[#1A1A2E] hover:bg-[#F9F8FF]',
    outline: 'btn-outline',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-sm',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
