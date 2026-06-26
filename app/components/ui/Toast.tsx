

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500 dark:bg-green-600',
    error: 'bg-red-500 dark:bg-red-600',
    info: 'bg-blue-500 dark:bg-blue-600',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[type];

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-[fade-in_0.3s_ease-out]"
      role="alert"
    >
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px]`}
      >
        <span className="text-xl font-bold">{icon}</span>
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white text-xl leading-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
