import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}

export function StatCard({ icon, label, value, highlight = false }: StatCardProps) {
  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-6 border transition-all duration-300
      ${highlight 
        ? 'bg-red-50 border-red-200 shadow-lg shadow-red-100 dark:bg-red-950/20 dark:border-red-900/50' 
        : 'bg-card border-border shadow-sm hover:shadow-md'}
    `}>
      <div className="flex items-center gap-4">
        <div className={`
          p-3 rounded-xl 
          ${highlight ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-secondary text-primary'}
        `}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <h4 className={`text-2xl font-bold font-display ${highlight ? 'text-red-700 dark:text-red-400' : 'text-foreground'}`}>
            {value}
          </h4>
        </div>
      </div>
    </div>
  );
}
