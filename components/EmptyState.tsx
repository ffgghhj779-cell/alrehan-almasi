import { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center"
      role="status"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-primary/10 to-green-accent/10 flex items-center justify-center mb-6 luxury-shadow">
        <Icon className="text-blue-primary" size={36} aria-hidden="true" />
      </div>
      <h3 className="font-cairo font-bold text-xl text-blue-deep mb-2">{title}</h3>
      <p className="text-gray-500 font-tajawal text-sm max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
