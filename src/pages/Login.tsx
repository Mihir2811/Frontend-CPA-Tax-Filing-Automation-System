import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center animate-fade-in">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-lg">
              <span className="text-3xl font-bold text-primary-foreground">V</span>
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-primary-foreground">CPA Automation</h1>
          <p className="text-lg text-primary-foreground/70">Tax Document Processing Platform</p>
          <p className="mt-6 text-sm text-primary-foreground/50">
            Streamline tax document processing with AI-powered extraction and intelligent form recognition.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 lg:hidden flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary">
              <span className="text-2xl font-bold text-primary-foreground">V</span>
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="mb-8 text-sm text-muted-foreground">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button type="button" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-semibold">
              <Lock className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
