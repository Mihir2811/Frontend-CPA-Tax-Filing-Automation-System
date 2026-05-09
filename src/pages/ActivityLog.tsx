import { useState } from 'react';
import { Search, FileText, User, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { mockActivityLog } from '@/data/mockData';

export default function ActivityLog() {
  const [search, setSearch] = useState('');

  const filtered = mockActivityLog.filter(entry =>
    entry.action.toLowerCase().includes(search.toLowerCase()) ||
    entry.user.toLowerCase().includes(search.toLowerCase()) ||
    entry.details.toLowerCase().includes(search.toLowerCase())
  );

  const actionIcon = (action: string) => {
    if (action.includes('Upload')) return 'bg-primary/10 text-primary';
    if (action.includes('Completed')) return 'bg-success/10 text-success';
    if (action.includes('Failed')) return 'bg-destructive/10 text-destructive';
    if (action.includes('Email')) return 'bg-info/10 text-info';
    if (action.includes('User')) return 'bg-accent/10 text-accent';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
        <p className="text-sm text-muted-foreground">Track all system activities and events</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search activities..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10" />
      </div>

      <div className="space-y-3">
        {filtered.map((entry) => (
          <div key={entry.id} className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${actionIcon(entry.action)}`}>
              {entry.action.includes('Upload') || entry.action.includes('Form') ? <FileText className="h-5 w-5" /> : entry.action.includes('User') ? <User className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{entry.action}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(entry.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{entry.details}</p>
              {entry.documentName && (
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-primary font-medium">
                  <FileText className="h-3 w-3" /> {entry.documentName}
                </span>
              )}
              <p className="text-xs text-muted-foreground mt-1">by {entry.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
