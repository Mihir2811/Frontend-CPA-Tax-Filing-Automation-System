import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, Users, ScrollText, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { currentUser } from '@/data/mockData';

const navItems = [
  { label: 'My Documents', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload New', path: '/upload', icon: Upload },
  { label: 'Activity Log', path: '/activity-log', icon: ScrollText },
  { label: 'User Management', path: '/users', icon: Users },
];

export default function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <span className="text-sm font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-lg font-bold text-foreground">CPA <span className="font-normal text-muted-foreground">Automation</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-foreground">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/login')} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
