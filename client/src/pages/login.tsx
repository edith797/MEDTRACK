import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login, createGuestUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    // Check for specific credentials: edith@gmail.com / edith
    if (email.toLowerCase() === "edith@gmail.com" && password === "edith") {
      login({
        id: '1',
        username: 'Edith',
        email,
        isGuest: false
      });
      
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Use edith@gmail.com with password 'edith'",
        variant: "destructive"
      });
    }
  };
  
  const handleGuestAccess = () => {
    createGuestUser();
    navigate("/dashboard");
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side: Image and branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-foreground p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute opacity-10 top-0 left-0 w-full h-full">
          {/* Background decoration elements */}
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full border-8 border-white opacity-20"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 rounded-full border-8 border-white opacity-20"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full border-8 border-white opacity-20"></div>
        </div>
        
        {/* Decorative pills animation */}
        <div className="relative z-10">
          {/* Pill 1 */}
          <div className="animate-[float_6s_ease-in-out_infinite] absolute top-20 left-20 bg-white rounded-full w-10 h-16 opacity-30 shadow-lg transform rotate-12"></div>
          {/* Pill 2 */}
          <div className="animate-[float_6s_ease-in-out_infinite_1s] absolute top-60 right-40 bg-white rounded-full w-8 h-14 opacity-20 shadow-lg transform -rotate-12"></div>
          {/* Pill 3 */}
          <div className="animate-[float_6s_ease-in-out_infinite_2s] absolute bottom-40 left-1/3 bg-white rounded-full w-12 h-20 opacity-25 shadow-lg transform rotate-45"></div>
        </div>
        
        {/* Branding content */}
        <div className="z-10">
          <h1 className="text-4xl font-bold text-white mb-2">MedTrack</h1>
          <p className="text-primary-50 text-xl">Your personal medicine companion</p>
        </div>
        
        {/* Feature highlights */}
        <div className="z-10 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <i className="fas fa-pills text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-white font-medium">Track Medications</h3>
              <p className="text-primary-100 text-sm">Manage all your prescriptions in one place</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <i className="fas fa-bell text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-white font-medium">Timely Reminders</h3>
              <p className="text-primary-100 text-sm">Never miss a dose with browser notifications</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <i className="fas fa-calendar-alt text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-white font-medium">Schedule Overview</h3>
              <p className="text-primary-100 text-sm">Daily and weekly medication timelines</p>
            </div>
          </div>
        </div>
        
        {/* Footer text */}
        <div className="z-10 text-primary-100 text-sm">
          <p>© {new Date().getFullYear()} MedTrack. All data is stored locally on your device.</p>
        </div>
      </div>
      
      {/* Right side: Login form */}
      <div className="w-full lg:w-1/2 p-6 sm:p-12 flex flex-col items-center justify-center">
        {/* Mobile logo (only visible on small screens) */}
        <div className="lg:hidden flex items-center justify-center mb-8 w-full">
          <div className="bg-primary text-white p-3 rounded-lg mr-3">
            <i className="fas fa-pills text-xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-primary">MedTrack</h1>
        </div>
        
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Log in to access your medication dashboard</p>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email field */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-gray-400"></i>
                    </div>
                    <Input 
                      type="email" 
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="your.email@example.com" 
                      required
                    />
                  </div>
                </div>
                
                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <a href="#" className="text-sm text-primary hover:text-primary-foreground">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400"></i>
                    </div>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      id="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10" 
                      placeholder="••••••••" 
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Remember me checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember-me" className="text-sm text-gray-700">
                    Remember me for 30 days
                  </Label>
                </div>
                
                {/* Login button */}
                <Button type="submit" className="w-full">
                  Log in
                </Button>
                
                {/* Divider */}
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                {/* Social logins */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Social login",
                        description: "Google login is not available in this demo",
                      });
                    }}
                  >
                    <i className="fab fa-google text-red-500 mr-2"></i>
                    Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Social login",
                        description: "Apple login is not available in this demo",
                      });
                    }}
                  >
                    <i className="fab fa-apple mr-2"></i>
                    Apple
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* No account prompt */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <a href="#" className="font-medium text-primary hover:text-primary-foreground ml-1">Sign up for free</a>
            </p>
          </div>
          
          {/* Guest access option */}
          <div className="text-center mt-4">
            <Button 
              type="button"
              variant="link"
              className="text-sm font-medium text-secondary hover:text-secondary-foreground"
              onClick={handleGuestAccess}
            >
              Try as guest without an account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
