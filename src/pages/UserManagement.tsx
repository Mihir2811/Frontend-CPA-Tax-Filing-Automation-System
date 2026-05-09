import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RoleBadge } from '@/components/StatusBadge';
import { mockUsers } from '@/data/mockData';
import { User, UserRole } from '@/types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ username: '', firstName: '', lastName: '', email: '', role: 'preparer' as UserRole, password: '', confirmPassword: '', isActive: true });

  const openCreate = () => {
    setEditingUser(null);
    setForm({ username: '', firstName: '', lastName: '', email: '', role: 'preparer', password: '', confirmPassword: '', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, password: '', confirmPassword: '', isActive: user.isActive });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...form } : u));
    } else {
      setUsers(prev => [...prev, { id: crypto.randomUUID(), ...form }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">{users.length} users</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> Create New User
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Username</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{user.username}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${user.isActive ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(user)} className="h-8 w-8 p-0"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Username</Label><Input value={form.username} onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div><Label>First Name</Label><Input value={form.firstName} onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))} /></div>
              <div><Label>Last Name</Label><Input value={form.lastName} onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))} /></div>
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm(f => ({ ...f, role: v as UserRole }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="preparer">Preparer</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!editingUser && (
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 8 characters" /></div>
                <div><Label>Confirm Password</Label><Input type="password" value={form.confirmPassword} onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))} /></div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm(f => ({ ...f, isActive: v }))} />
              <Label>Active</Label>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingUser ? 'Save Changes' : 'Create User'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
