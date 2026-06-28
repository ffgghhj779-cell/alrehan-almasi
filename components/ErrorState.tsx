import { AlertCircle, RefreshCw } from 'lucide-react';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center"
      role="alert"
    >
      <div className="w-16 h-16 rounded-full bg-orange-accent/10 flex items-center justify-center mb-4">
        <AlertCircle className="text-orange-accent" size={32} aria-hidden="true" />
      </div>
      <h3 className="font-cairo font-bold text-lg text-blue-deep mb-2">
        تعذّر تحميل البيانات
      </h3>
      <p className="text-gray-500 font-tajawal text-sm max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-primary text-white font-bold text-sm hover:bg-blue-deep transition-colors luxury-shadow"
        >
          <RefreshCw size={16} aria-hidden="true" />
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
