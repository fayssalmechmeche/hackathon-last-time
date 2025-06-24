import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="h-16 bg-background px-8 flex items-center justify-between">
      <div className="text-xl text-foreground">Nexolve</div>

      {/* Desktop menu */}
      <div className="hidden sm:flex gap-4">
        <Button variant="ghost" asChild>
          <Link to="/login">Se connecter</Link>
        </Button>
        <Button variant="default" asChild>
          <Link to="/register">S'inscrire</Link>
        </Button>
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
          </div>
        </div>
      )}
    </nav>
  );
}
