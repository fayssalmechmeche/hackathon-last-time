import { Link } from "react-router";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="h-16 bg-background border-b border-border px-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-foreground">
        Nexolve
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <Button variant="ghost" asChild>
          <Link to="/login">Se connecter</Link>
        </Button>
        <Button variant="default" asChild>
          <Link to="/register">S'inscrire</Link>
        </Button>
      </div>
    </nav>
  );
}
