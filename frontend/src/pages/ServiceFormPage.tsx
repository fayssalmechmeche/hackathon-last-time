import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { servicesApiMethods, type ServiceResponse } from "../lib/api";

export default function ServiceFormPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<ServiceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) {
        navigate("/services");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await servicesApiMethods.getService(serviceId);
        setService(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du service:", error);
        setError("Impossible de charger le service");
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [serviceId, navigate]);

  const handleSubmit = async (data: { formData?: Record<string, unknown> }) => {
    if (!data.formData) return;

    setIsSubmitting(true);
    console.log("Données du formulaire:", data.formData);

    // Simulation d'un appel API
    try {
      // Ici vous pourriez faire un appel API réel
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Formulaire soumis avec succès !");
      navigate("/services");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert("Erreur lors de la soumission du formulaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate("/services");
  };

  // Gestion des états de chargement et d'erreur
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              Chargement du service...
            </h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {error || "Service non trouvé"}
            </h1>
            <Button
              onClick={handleGoBack}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Retour aux services
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!service.jsonSchema) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Schéma de service non disponible
            </h1>
            <Button
              onClick={handleGoBack}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Retour aux services
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="text-muted-foreground hover:text-foreground mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">{service.title}</h1>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            {service.description}
          </p>

          {/* Form */}
          <Card className="bg-card border-border max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-foreground">
                Configuration du service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rjsf-form">
                <Form
                  schema={service.jsonSchema}
                  formData={formData}
                  validator={validator}
                  onChange={(e) => setFormData(e.formData || {})}
                  onSubmit={(data) => handleSubmit({ formData: data.formData })}
                  disabled={isSubmitting}
                >
                  <div className="flex gap-4 mt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      {isSubmitting ? (
                        "Traitement en cours..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Lancer le traitement
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoBack}
                      disabled={isSubmitting}
                      className="border-border text-muted-foreground hover:bg-muted"
                    >
                      Annuler
                    </Button>
                  </div>
                </Form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom styles for RJSF */}
        <style>{`
          .rjsf-form .form-group {
            margin-bottom: 1.5rem;
          }

          .rjsf-form label {
            color: #f9fafb !important;
            font-weight: 500;
            margin-bottom: 0.5rem;
            display: block;
          }

          .rjsf-form input,
          .rjsf-form select,
          .rjsf-form textarea {
            background-color: #374151 !important;
            border: 1px solid #6b7280 !important;
            color: #f9fafb !important;
            border-radius: 0.375rem;
            padding: 0.5rem 0.75rem;
            width: 100%;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          }

          .rjsf-form input:focus,
          .rjsf-form select:focus,
          .rjsf-form textarea:focus {
            outline: none !important;
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2) !important;
          }

          .rjsf-form input:hover,
          .rjsf-form select:hover,
          .rjsf-form textarea:hover {
            border-color: #9ca3af !important;
          }

          .rjsf-form .form-check-input {
            width: auto;
          }

          /* Amélioration de la visibilité des boutons de fichier */
          .rjsf-form input[type="file"] {
            background-color: #4b5563 !important;
            border: 2px dashed #6b7280 !important;
            color: #f9fafb !important;
            padding: 1rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .rjsf-form input[type="file"]:hover {
            border-color: #8b5cf6 !important;
            background-color: #374151 !important;
          }

          /* Style des options select */
          .rjsf-form select option {
            background-color: #374151 !important;
            color: #f9fafb !important;
          }

          /* Style des checkboxes et radio buttons */
          .rjsf-form input[type="checkbox"],
          .rjsf-form input[type="radio"] {
            width: 1rem;
            height: 1rem;
            margin-right: 0.5rem;
            accent-color: #8b5cf6;
          }

          /* Style des ranges */
          .rjsf-form input[type="range"] {
            background: #4b5563 !important;
            height: 6px;
            border-radius: 3px;
            padding: 0;
          }

          .rjsf-form input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #8b5cf6 !important;
            cursor: pointer;
          }
        `}</style>
      </div>
    </Layout>
  );
}
