import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import Layout from "../components/Layout";
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
import { authApi, type User } from "../lib/auth";
import { editProfileSchema, type EditProfileFormData } from "../lib/validations";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const profile = await authApi.getProfile();
        setUser(profile);
        
        // Pre-populate form fields
        setValue("fullName", profile.full_name || "");
        setValue("jobTitle", profile.job_title || "");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // If profile fetch fails, user might have invalid token
        localStorage.removeItem("authToken");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, setValue]);

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      const updatedUser = await authApi.updateProfile({
        full_name: data.fullName,
        job_title: data.jobTitle,
      });
      
      setUser(updatedUser);
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background">
          <div className="text-center">
            <div className="text-lg">Chargement...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // This shouldn't happen as we redirect to login, but just in case
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Modifier mon profil</CardTitle>
            <CardDescription>Mettez à jour vos informations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input id="fullName" type="text" {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Titre du poste</Label>
                <Input id="jobTitle" type="text" {...register("jobTitle")} />
                {errors.jobTitle && (
                  <p className="text-sm text-destructive">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
