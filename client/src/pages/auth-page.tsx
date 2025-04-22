import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("edith@gmail.com");
  const [loginPassword, setLoginPassword] = useState("edith");
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register form state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Add a console log when the component mounts
  useEffect(() => {
    console.log("AuthPage mounted - pre-filled with:", loginEmail, loginPassword);
  }, []);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted with:", loginEmail, loginPassword);
    
    // Basic validation
    if (!loginEmail || !loginPassword) {
      console.log("Login validation failed: missing email or password");
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    // Login through the API
    loginMutation.mutate({
      username: loginEmail,
      password: loginPassword,
    });
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!registerUsername || !registerEmail || !registerPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (!termsAccepted) {
      toast({
        title: "Validation Error",
        description: "You must accept the terms and conditions",
        variant: "destructive"
      });
      return;
    }
    
    // Register through the API
    registerMutation.mutate({
      username: registerUsername,
      email: registerEmail,
      password: registerPassword,
      isGuest: false
    });
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
          <p>© {new Date().getFullYear()} MedTrack. All data is stored securely.</p>
        </div>
      </div>
      
      {/* Right side: Login & Registration forms */}
      <div className="w-full lg:w-1/2 p-6 sm:p-12 flex flex-col items-center justify-center">
        {/* Mobile logo (only visible on small screens) */}
        <div className="lg:hidden flex items-center justify-center mb-8 w-full">
          <div className="bg-primary text-white p-3 rounded-lg mr-3">
            <i className="fas fa-pills text-xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-primary">MedTrack</h1>
        </div>
        
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Log in to access your medication dashboard</p>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleLogin} className="space-y-4">
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
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
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
                          type={showLoginPassword ? "text" : "password"}
                          id="password" 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 pr-10" 
                          placeholder="••••••••" 
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button 
                            type="button" 
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            {showLoginPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
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
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : "Log in"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Quick login message */}
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>For testing, use <strong>edith@gmail.com</strong> / <strong>edith</strong></p>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600">Sign up to track your medications</p>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    {/* Username field */}
                    <div>
                      <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1">Username</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-user text-gray-400"></i>
                        </div>
                        <Input 
                          type="text" 
                          id="username" 
                          value={registerUsername}
                          onChange={(e) => setRegisterUsername(e.target.value)}
                          className="pl-10"
                          placeholder="johndoe" 
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Email field */}
                    <div>
                      <Label htmlFor="register-email" className="text-sm font-medium text-gray-700 mb-1">Email</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-envelope text-gray-400"></i>
                        </div>
                        <Input 
                          type="email" 
                          id="register-email" 
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-10"
                          placeholder="john.doe@example.com" 
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Password field */}
                    <div>
                      <Label htmlFor="register-password" className="text-sm font-medium text-gray-700 mb-1">Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-lock text-gray-400"></i>
                        </div>
                        <Input 
                          type={showRegisterPassword ? "text" : "password"}
                          id="register-password" 
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-10 pr-10" 
                          placeholder="••••••••" 
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button 
                            type="button" 
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            {showRegisterPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Confirm Password field */}
                    <div>
                      <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 mb-1">Confirm Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-lock text-gray-400"></i>
                        </div>
                        <Input 
                          type={showRegisterPassword ? "text" : "password"}
                          id="confirm-password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10" 
                          placeholder="••••••••" 
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Terms and conditions */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the <a href="#" className="text-primary hover:text-primary-foreground">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-foreground">Privacy Policy</a>
                      </Label>
                    </div>
                    
                    {/* Register button */}
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}