import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Home, User, LogOut, Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { checkNotificationPermission, requestNotificationPermission } from "@/lib/notification";

export default function NavBar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await checkNotificationPermission();
      setNotificationPermission(hasPermission);
    };
    
    checkPermission();
  }, []);
  
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted);
  };
  
  return (
    <nav className="bg-white border-b px-6 py-3 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/dashboard">
            <div className="flex items-center cursor-pointer">
              <div className="bg-primary rounded-lg p-2 mr-2">
                <i className="fas fa-pills text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-primary hidden md:inline">MedTrack</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {notificationPermission === false && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestPermission}
              className="mr-2"
            >
              <Bell className="h-4 w-4 mr-2" />
              Enable Notifications
            </Button>
          )}
          
          <Button
            variant={location === "/dashboard" ? "default" : "ghost"}
            size="sm"
            asChild
            className="hidden md:flex"
          >
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center cursor-pointer w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <User className="h-4 w-4 mr-2" />
                {user?.isGuest ? 'Guest' : user?.username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
