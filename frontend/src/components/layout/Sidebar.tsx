import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  ChartLine, 
  PlusCircle, 
  DollarSign, 
  Edit3, 
  Search, 
  Folder, 
  ListChecks, 
  FileText, 
  Microscope, 
  Copy, 
  Tags, 
  Brain, 
  Shield, 
  UserCheck, 
  Award, 
  User, 
  Settings, 
  Fingerprint,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigationSections = [
  {
    title: "Dashboard",
    items: [
      { label: "Overview", icon: BarChart3, href: "/", active: true },
      { label: "Analytics", icon: ChartLine, href: "/analytics" },
    ],
  },
  {
    title: "Patenting",
    items: [
      { label: "File New Patent", icon: PlusCircle, href: "/patents/file" },
      { label: "AI Patent Valuation", icon: DollarSign, href: "/patents/valuation" },
      { label: "Drafting Assistant", icon: Edit3, href: "/patents/drafting" },
      { label: "Quick Verification", icon: Search, href: "/patents/verify" },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { label: "My Patents", icon: Folder, href: "/patents/my-patents" },
      { label: "Status Tracking", icon: ListChecks, href: "/patents/status" },
      { label: "Document Management", icon: FileText, href: "/patents/documents" },
    ],
  },
  {
    title: "AI Services",
    items: [
      { label: "Prior Art Search", icon: Microscope, href: "/ai/prior-art-search" },
      { label: "Similarity Detection", icon: Copy, href: "/ai/similarity" },
      { label: "Classification", icon: Tags, href: "/ai/classification" },
      { label: "Patent Analytics", icon: Brain, href: "/ai/analytics" },
    ],
  },
  {
    title: "Security",
    items: [
      { label: "Blockchain Verification", icon: Shield, href: "/verification/blockchain" },
      { label: "Ownership Verification", icon: UserCheck, href: "/verification/ownership" },
      { label: "Patent Certificates", icon: Award, href: "/verification/certificates" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", icon: User, href: "/profile" },
      { label: "Settings", icon: Settings, href: "/settings" },
    ],
  },
];

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export default function Sidebar({ className, onItemClick }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <aside className={cn("flex flex-col w-80 bg-white border-r border-gray-200 shadow-sm h-full", className)} data-testid="sidebar">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center h-16 px-6 bg-primary flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Fingerprint className="text-primary text-lg" />
          </div>
          <span className="text-white font-bold text-xl">Patent Hash</span>
        </div>
      </div>

      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0 scrollbar-thin" data-testid="sidebar-nav">
        {navigationSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("sidebar-nav-item", isActive && "active")}
                    onClick={onItemClick}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="mr-3" size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile at Bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4" data-testid="user-profile">
        <div className="flex items-center w-full">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || ""} />
            <AvatarFallback className="bg-primary text-white font-semibold text-sm">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="ml-2 text-gray-400 hover:text-gray-600"
            data-testid="button-logout"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </aside>
  );
}
