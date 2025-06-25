import { Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { authApi, type User as UserType } from "../lib/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // If profile fetch fails, user might have invalid token
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  const getAvatarFallback = (fullName: string | null) => {
    if (!fullName) {
      return <User className="h-4 w-4" />;
    }
    return fullName.charAt(0).toUpperCase();
  };

  return (
    <nav className="h-16 bg-background px-8 flex items-center justify-between">
      <div className="text-xl text-foreground">Nexolve</div>

      {/* Desktop menu */}
      <div className="hidden sm:flex gap-4 items-center">
        {isAuthenticated && user ? (
          <>
            <Button variant="ghost" asChild>
              <Link to="/services">Services</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getAvatarFallback(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={() => navigate("/")}>
                  Gérer mes services
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile/edit")}>
                  Modifier mon profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button variant="default" asChild>
              <Link to="/register">S'inscrire</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="sm:hidden p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border sm:hidden">
          <div className="flex flex-col p-4 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 p-2 border-b border-border mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getAvatarFallback(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {user.full_name || user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate("/services");
                    setIsMenuOpen(false);
                  }}
                >
                  Services
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate("/");
                    setIsMenuOpen(false);
                  }}
                >
                  Gérer mes services
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate("/");
                    setIsMenuOpen(false);
                  }}
                >
                  Modifier mon profil
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/login">Se connecter</Link>
                </Button>
                <Button
                  variant="default"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/register">S'inscrire</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
