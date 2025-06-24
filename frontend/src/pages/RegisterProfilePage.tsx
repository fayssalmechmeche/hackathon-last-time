import { useEffect, useState } from "react";
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
import Layout from "../components/Layout";

export default function RegisterProfilePage() {
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check for cached registration data from step 1
    const cachedData = sessionStorage.getItem("registrationData");
    if (!cachedData) {
      // No cached data, redirect to step 1
      navigate("/register");
      return;
    }

    try {
      const { email, password } = JSON.parse(cachedData);
      // Simple validation
      if (
        !email ||
        !email.includes("@") ||
        !password ||
        password.length === 0
      ) {
        // Invalid cached data, redirect to step 1
        sessionStorage.removeItem("registrationData");
        navigate("/register");
      }
    } catch {
      // Invalid JSON, redirect to step 1
      sessionStorage.removeItem("registrationData");
      navigate("/register");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Retrieve cached data from step 1
      const cachedData = sessionStorage.getItem("registrationData");
      if (!cachedData) {
        navigate("/register");
        return;
      }

      const { email, password } = JSON.parse(cachedData);

      // Single API call with all registration data
      console.log("Complete registration:", {
        email,
        password,
        fullName,
        jobTitle,
      });

      // Clear cached data after successful registration
      sessionStorage.removeItem("registrationData");

      // Future-proof redirect - easy to change later
      const redirectPath = "/login";
      navigate(redirectPath);
    } catch (error) {
      // TODO: Handle error
      console.error("Registration error:", error);
    }
  };

  return (
    <Layout>
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
    </Layout>
  );
}
