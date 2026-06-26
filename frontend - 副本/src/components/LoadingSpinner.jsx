import { Loader2 } from 'lucide-react';

function LoadingSpinner({ size = 32, text = '加载中...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 
        size={size} 
        className="text-primary animate-spin mb-3"
      />
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}

export default LoadingSpinner;