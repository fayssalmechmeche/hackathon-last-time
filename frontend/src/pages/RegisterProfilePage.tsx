import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function RegisterProfilePage() {
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // API call will be implemented here
      console.log("Registration step 2:", { fullName, jobTitle });

      // On success, redirect to login or dashboard
      navigate("/login");
    } catch (error) {
      // TODO: Handle error
      console.error("Profile registration error:", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Finaliser votre inscription
          </CardTitle>
          <CardDescription>Complétez votre profil</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFullName(e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Titre du poste</Label>
              <Input
                id="jobTitle"
                type="text"
                value={jobTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setJobTitle(e.target.value)
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Terminer l'inscription
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
