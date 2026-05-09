import { currentUser } from '@/data/mockData';
import { RoleBadge } from '@/components/StatusBadge';
import { User, Mail, Shield } from 'lucide-react';

export default function Profile() {
  return (
    <div className="p-6 animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Profile</h1>
      <div className="rounded-lg border border-border bg-card shadow-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{currentUser.firstName} {currentUser.lastName}</h2>
            <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-foreground">{currentUser.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Role:</span>
            <RoleBadge role={currentUser.role} />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className={`h-2 w-2 rounded-full ${currentUser.isActive ? 'bg-success' : 'bg-muted-foreground'}`} />
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium text-foreground">{currentUser.isActive ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
