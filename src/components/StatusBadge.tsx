import { DocumentStatus, UserRole } from '@/types';

const statusStyles: Record<DocumentStatus, string> = {
  pending: 'bg-warning/15 text-warning border-warning/30',
  processing: 'bg-info/15 text-info border-info/30',
  completed: 'bg-success/15 text-success border-success/30',
  failed: 'bg-destructive/15 text-destructive border-destructive/30',
};

const roleStyles: Record<UserRole, string> = {
  admin: 'bg-accent/15 text-accent border-accent/30',
  preparer: 'bg-info/15 text-info border-info/30',
  reviewer: 'bg-success/15 text-success border-success/30',
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${roleStyles[role]}`}>
      {role}
    </span>
  );
}
