import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
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
import { authApi } from "../lib/auth";
import { registerStep2Schema, type RegisterStep2FormData } from "../lib/validations";

export default function RegisterProfilePage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterStep2FormData>({
    resolver: zodResolver(registerStep2Schema),
  });

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

  const onSubmit = async (data: RegisterStep2FormData) => {
    try {
      // Retrieve cached data from step 1
      const cachedData = sessionStorage.getItem("registrationData");
      if (!cachedData) {
        navigate("/register");
        return;
      }

      const { email, password } = JSON.parse(cachedData);

      // Make the API call to register the user
      const response = await authApi.register({
        email,
        password,
        full_name: data.fullName,
        job_title: data.jobTitle,
      });

      // Store the JWT token in localStorage
      localStorage.setItem("token", response.token);

      // Clear cached data after successful registration
      sessionStorage.removeItem("registrationData");

      // Show success message and redirect to home
      toast.success("Inscription réussie ! Bienvenue !");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle axios errors
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { status?: number } }).response;
        if (response?.status === 400) {
          toast.error("Données invalides. Veuillez vérifier vos informations.");
        } else if (response?.status === 409) {
          toast.error("Un compte avec cet email existe déjà.");
        } else {
          toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
        }
      } else {
        toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
      }
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                type="text"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Titre du poste</Label>
              <Input
                id="jobTitle"
                type="text"
                {...register("jobTitle")}
              />
              {errors.jobTitle && (
                <p className="text-sm text-red-600">{errors.jobTitle.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Inscription en cours..." : "Terminer l'inscription"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
