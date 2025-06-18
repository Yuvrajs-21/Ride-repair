import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Wrench, Clock, User, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Chatbot from "@/components/chatbot";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/services", icon: Wrench, label: "Services" },
    { path: "/history", icon: Clock, label: "History" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-lg relative">
      {/* Header */}
      <header className="bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🔧</div>
          <h1 className="text-xl font-bold">RoadRescue</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-white hover:text-yellow-300">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Chatbot FAB */}
      <Button
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl bg-primary hover:bg-blue-700"
        onClick={() => setChatbotOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Chatbot */}
      <Chatbot open={chatbotOpen} onOpenChange={setChatbotOpen} />

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-neutral-100 px-4 py-2 flex justify-around items-center sticky bottom-0 z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={`flex flex-col items-center py-2 px-3 transition-colors ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-neutral-600 hover:text-primary"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
