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
import { ArrowLeft, Send } from "lucide-react";

// Mocks des différents JSON Schemas pour les services
const serviceSchemas = {
  "pdf-tools": {
    title: "Configuration PDF Tools",
    description: "Configurez vos outils de traitement PDF",
    schema: {
      type: "object",
      required: ["operation", "inputFile"],
      properties: {
        operation: {
          type: "string",
          title: "Type d'opération",
          enum: ["convert", "compress", "merge", "split"],
          enumNames: ["Convertir", "Compresser", "Fusionner", "Diviser"],
        },
        inputFile: {
          type: "string",
          title: "Fichier d'entrée",
          format: "data-url",
        },
        outputFormat: {
          type: "string",
          title: "Format de sortie",
          enum: ["pdf", "png", "jpg", "docx"],
          enumNames: ["PDF", "PNG", "JPG", "Word"],
          default: "pdf",
        },
        quality: {
          type: "integer",
          title: "Qualité (1-100)",
          minimum: 1,
          maximum: 100,
          default: 85,
        },
        pages: {
          type: "string",
          title: "Pages à traiter",
          description: "Ex: 1-3,5,7-9 ou 'all' pour toutes",
        },
      },
    },
    uiSchema: {
      inputFile: {
        "ui:widget": "file",
      },
      quality: {
        "ui:widget": "range",
      },
      pages: {
        "ui:placeholder": "all",
      },
    },
  },
  "image-tools": {
    title: "Configuration Image Tools",
    description: "Configurez vos outils de traitement d'images",
    schema: {
      type: "object",
      required: ["operation", "inputFile"],
      properties: {
        operation: {
          type: "string",
          title: "Type d'opération",
          enum: ["resize", "compress", "convert", "watermark"],
          enumNames: ["Redimensionner", "Compresser", "Convertir", "Filigrane"],
        },
        inputFile: {
          type: "string",
          title: "Image à traiter",
          format: "data-url",
        },
        additionalFiles: {
          type: "string",
          title: "Fichiers supplémentaires (optionnel)",
          description: "Sélectionnez d'autres images si nécessaire",
        },
        dimensions: {
          type: "object",
          title: "Dimensions",
          properties: {
            width: {
              type: "integer",
              title: "Largeur (px)",
              minimum: 1,
            },
            height: {
              type: "integer",
              title: "Hauteur (px)",
              minimum: 1,
            },
            maintainAspectRatio: {
              type: "boolean",
              title: "Conserver les proportions",
              default: true,
            },
          },
        },
        outputFormat: {
          type: "string",
          title: "Format de sortie",
          enum: ["jpg", "png", "webp", "gif"],
          enumNames: ["JPEG", "PNG", "WebP", "GIF"],
          default: "jpg",
        },
        quality: {
          type: "integer",
          title: "Qualité (1-100)",
          minimum: 1,
          maximum: 100,
          default: 90,
        },
      },
    },
    uiSchema: {
      inputFile: {
        "ui:widget": "file",
        "ui:options": {
          accept: "image/*",
        },
      },
      additionalFiles: {
        "ui:widget": "file",
        "ui:options": {
          accept: "image/*",
        },
      },
      quality: {
        "ui:widget": "range",
      },
    },
  },
  "video-tools": {
    title: "Configuration Video Tools",
    description: "Configurez vos outils de traitement vidéo",
    schema: {
      type: "object",
      required: ["operation", "inputFile"],
      properties: {
        operation: {
          type: "string",
          title: "Type d'opération",
          enum: ["compress", "convert", "extract-audio", "trim"],
          enumNames: ["Compresser", "Convertir", "Extraire audio", "Découper"],
        },
        inputFile: {
          type: "string",
          title: "Fichier vidéo",
          format: "data-url",
        },
        outputFormat: {
          type: "string",
          title: "Format de sortie",
          enum: ["mp4", "avi", "mov", "mkv", "mp3", "wav"],
          enumNames: ["MP4", "AVI", "MOV", "MKV", "MP3", "WAV"],
          default: "mp4",
        },
        resolution: {
          type: "string",
          title: "Résolution",
          enum: ["480p", "720p", "1080p", "4k", "original"],
          enumNames: ["480p", "720p", "1080p", "4K", "Originale"],
          default: "720p",
        },
        bitrate: {
          type: "integer",
          title: "Débit (kbps)",
          minimum: 100,
          maximum: 50000,
          default: 2000,
        },
        trimSettings: {
          type: "object",
          title: "Paramètres de découpage",
          properties: {
            startTime: {
              type: "string",
              title: "Temps de début",
              pattern: "^([0-9]{1,2}:)?[0-9]{1,2}:[0-9]{1,2}$",
              description: "Format: HH:MM:SS ou MM:SS",
            },
            endTime: {
              type: "string",
              title: "Temps de fin",
              pattern: "^([0-9]{1,2}:)?[0-9]{1,2}:[0-9]{1,2}$",
              description: "Format: HH:MM:SS ou MM:SS",
            },
          },
        },
      },
    },
    uiSchema: {
      inputFile: {
        "ui:widget": "file",
        "ui:options": {
          accept: "video/*",
        },
      },
      bitrate: {
        "ui:widget": "range",
      },
      trimSettings: {
        startTime: {
          "ui:placeholder": "00:00:00",
        },
        endTime: {
          "ui:placeholder": "00:05:00",
        },
      },
    },
  },
  "audio-tools": {
    title: "Configuration Audio Tools",
    description: "Configurez vos outils de traitement audio",
    schema: {
      type: "object",
      required: ["operation", "inputFile"],
      properties: {
        operation: {
          type: "string",
          title: "Type d'opération",
          enum: ["convert", "compress", "normalize", "merge"],
          enumNames: ["Convertir", "Compresser", "Normaliser", "Fusionner"],
        },
        inputFile: {
          type: "string",
          title: "Fichier audio",
          format: "data-url",
        },
        outputFormat: {
          type: "string",
          title: "Format de sortie",
          enum: ["mp3", "wav", "flac", "aac", "ogg"],
          enumNames: ["MP3", "WAV", "FLAC", "AAC", "OGG"],
          default: "mp3",
        },
        bitrate: {
          type: "integer",
          title: "Débit (kbps)",
          enum: [128, 192, 256, 320],
          default: 192,
        },
        sampleRate: {
          type: "integer",
          title: "Fréquence d'échantillonnage (Hz)",
          enum: [22050, 44100, 48000, 96000],
          default: 44100,
        },
        channels: {
          type: "string",
          title: "Canaux",
          enum: ["mono", "stereo"],
          enumNames: ["Mono", "Stéréo"],
          default: "stereo",
        },
      },
    },
    uiSchema: {
      inputFile: {
        "ui:widget": "file",
        "ui:options": {
          accept: "audio/*",
        },
      },
    },
  },
  "data-tools": {
    title: "Configuration Data Tools",
    description: "Configurez vos outils de traitement de données",
    schema: {
      type: "object",
      required: ["operation", "inputFile"],
      properties: {
        operation: {
          type: "string",
          title: "Type d'opération",
          enum: ["convert", "clean", "merge", "split"],
          enumNames: ["Convertir", "Nettoyer", "Fusionner", "Diviser"],
        },
        inputFile: {
          type: "string",
          title: "Fichier de données",
          format: "data-url",
        },
        outputFormat: {
          type: "string",
          title: "Format de sortie",
          enum: ["csv", "json", "xlsx", "xml"],
          enumNames: ["CSV", "JSON", "Excel", "XML"],
          default: "csv",
        },
        delimiter: {
          type: "string",
          title: "Délimiteur CSV",
          enum: [",", ";", "|", "\t"],
          enumNames: ["Virgule", "Point-virgule", "Pipe", "Tabulation"],
          default: ",",
        },
        encoding: {
          type: "string",
          title: "Encodage",
          enum: ["utf-8", "latin1", "cp1252"],
          enumNames: ["UTF-8", "Latin1", "Windows-1252"],
          default: "utf-8",
        },
        cleaningOptions: {
          type: "object",
          title: "Options de nettoyage",
          properties: {
            removeEmptyRows: {
              type: "boolean",
              title: "Supprimer les lignes vides",
              default: true,
            },
            removeDuplicates: {
              type: "boolean",
              title: "Supprimer les doublons",
              default: false,
            },
            trimWhitespace: {
              type: "boolean",
              title: "Supprimer les espaces en trop",
              default: true,
            },
          },
        },
      },
    },
    uiSchema: {
      inputFile: {
        "ui:widget": "file",
        "ui:options": {
          accept: ".csv,.json,.xlsx,.xml",
        },
      },
    },
  },
  "quick-convert": {
    title: "Configuration Quick Convert",
    description: "Conversion rapide entre formats de fichiers",
    schema: {
      type: "object",
      required: ["inputFile", "outputFormat"],
      properties: {
        inputFile: {
          type: "string",
          title: "Fichier à convertir",
          format: "data-url",
        },
        outputFormat: {
          type: "string",
          title: "Format de sortie",
          enum: ["pdf", "png", "jpg", "docx", "mp3", "mp4", "csv", "json"],
          enumNames: ["PDF", "PNG", "JPG", "Word", "MP3", "MP4", "CSV", "JSON"],
        },
        quality: {
          type: "integer",
          title: "Qualité (1-100)",
          minimum: 1,
          maximum: 100,
          default: 85,
        },
        autoDetectFormat: {
          type: "boolean",
          title: "Détection automatique du format",
          default: true,
        },
      },
    },
    uiSchema: {
      inputFile: {
        "ui:widget": "file",
      },
      quality: {
        "ui:widget": "range",
      },
    },
  },
  "design-tools": {
    title: "Configuration Design Tools",
    description: "Créez et personnalisez vos designs",
    schema: {
      type: "object",
      required: ["designType"],
      properties: {
        designType: {
          type: "string",
          title: "Type de design",
          enum: ["logo", "banner", "social-media", "poster"],
          enumNames: ["Logo", "Bannière", "Réseaux sociaux", "Poster"],
        },
        dimensions: {
          type: "object",
          title: "Dimensions",
          properties: {
            width: {
              type: "integer",
              title: "Largeur (px)",
              minimum: 100,
              default: 1920,
            },
            height: {
              type: "integer",
              title: "Hauteur (px)",
              minimum: 100,
              default: 1080,
            },
            preset: {
              type: "string",
              title: "Preset de taille",
              enum: [
                "facebook-cover",
                "instagram-post",
                "linkedin-banner",
                "custom",
              ],
              enumNames: [
                "Couverture Facebook",
                "Post Instagram",
                "Bannière LinkedIn",
                "Personnalisé",
              ],
            },
          },
        },
        colorScheme: {
          type: "object",
          title: "Palette de couleurs",
          properties: {
            primary: {
              type: "string",
              title: "Couleur principale",
              format: "color",
              default: "#3b82f6",
            },
            secondary: {
              type: "string",
              title: "Couleur secondaire",
              format: "color",
              default: "#f59e0b",
            },
            background: {
              type: "string",
              title: "Couleur de fond",
              format: "color",
              default: "#ffffff",
            },
          },
        },
        text: {
          type: "object",
          title: "Texte",
          properties: {
            mainText: {
              type: "string",
              title: "Texte principal",
            },
            subtitle: {
              type: "string",
              title: "Sous-titre",
            },
            fontFamily: {
              type: "string",
              title: "Police",
              enum: [
                "Arial",
                "Helvetica",
                "Georgia",
                "Times",
                "Roboto",
                "Open Sans",
              ],
              default: "Roboto",
            },
          },
        },
      },
    },
    uiSchema: {
      colorScheme: {
        primary: {
          "ui:widget": "color",
        },
        secondary: {
          "ui:widget": "color",
        },
        background: {
          "ui:widget": "color",
        },
      },
      text: {
        mainText: {
          "ui:widget": "textarea",
        },
        subtitle: {
          "ui:widget": "textarea",
        },
      },
    },
  },
  "document-tools": {
    title: "Configuration Document Tools",
    description: "Gérez vos documents et présentations",
    schema: {
      type: "object",
      required: ["operation", "inputFile"],
      properties: {
        operation: {
          type: "string",
          title: "Type d'opération",
          enum: ["merge", "split", "protect", "convert"],
          enumNames: ["Fusionner", "Diviser", "Protéger", "Convertir"],
        },
        inputFile: {
          type: "string",
          title: "Document principal",
          format: "data-url",
        },
        additionalFiles: {
          type: "string",
          title: "Documents supplémentaires (optionnel)",
          description: "Pour les opérations de fusion",
        },
        password: {
          type: "string",
          title: "Mot de passe (pour protection)",
          description: "Laisser vide si non nécessaire",
        },
        pageRange: {
          type: "string",
          title: "Pages à traiter",
          description: "Ex: 1-5,8,10-12 ou 'all' pour toutes",
          default: "all",
        },
        outputFormat: {
          type: "string",
          title: "Format de sortie",
          enum: ["pdf", "docx", "pptx", "txt"],
          enumNames: ["PDF", "Word", "PowerPoint", "Texte"],
          default: "pdf",
        },
      },
    },
    uiSchema: {
      inputFile: {
        "ui:widget": "file",
        "ui:options": {
          accept: ".pdf,.docx,.pptx,.txt",
        },
      },
      additionalFiles: {
        "ui:widget": "file",
        "ui:options": {
          accept: ".pdf,.docx,.pptx,.txt",
        },
      },
      password: {
        "ui:widget": "password",
      },
    },
  },
};

export default function ServiceFormPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceConfig =
    serviceSchemas[serviceId as keyof typeof serviceSchemas];

  useEffect(() => {
    if (!serviceConfig) {
      navigate("/services");
    }
  }, [serviceConfig, navigate]);

  const handleSubmit = async (data: { formData: Record<string, unknown> }) => {
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

  if (!serviceConfig) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service non trouvé</h1>
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
            <h1 className="text-3xl font-bold">{serviceConfig.title}</h1>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            {serviceConfig.description}
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
                  schema={serviceConfig.schema}
                  uiSchema={serviceConfig.uiSchema}
                  formData={formData}
                  validator={validator}
                  onChange={(e) => setFormData(e.formData)}
                  onSubmit={handleSubmit}
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
        <style jsx global>{`
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
