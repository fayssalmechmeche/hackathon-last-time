import {
  AlertCircle,
  Bot,
  Calendar,
  Edit,
  ExternalLink,
  Hash,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  ToggleLeft,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { servicesApiMethods, type UpdateServiceRequest } from "../lib/api";

// Types
interface Service {
  _id: string;
  title: string;
  description: string;
  iconName: string;
  gradient: string;
  status: "active" | "inactive";
  type: "automatic" | "manual";
  swaggerUrl?: string;
  baseUrl?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  modelId?: string;
  jsonSchema?: object;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface FormField {
  id: number;
  type: "file" | "text" | "number" | "date" | "select";
  label: string;
  required: boolean;
  options?: string[];
}

interface EditFormData {
  title: string;
  description: string;
  iconName: string;
  gradient: string;
  status: "active" | "inactive";
  baseUrl: string;
  apiKey: string;
  apiKeyHeader: string;
  modelId: string;
  swaggerUrl: string;
  fields: FormField[];
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">
            {title}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Available icons (reusing from ListServices)
const availableIcons = [
  { name: "Settings", icon: Settings, label: "Paramètres" },
  { name: "Bot", icon: Bot, label: "Bot" },
  { name: "Upload", icon: Upload, label: "Télécharger" },
  { name: "Edit", icon: Edit, label: "Modifier" },
  { name: "Search", icon: Search, label: "Rechercher" },
  { name: "Hash", icon: Hash, label: "Hash" },
  { name: "Type", icon: Type, label: "Texte" },
  { name: "Calendar", icon: Calendar, label: "Calendrier" },
];

// Available gradients
const availableGradients = [
  {
    name: "Violet vers Rose",
    value: "from-purple-500 to-pink-500",
    preview: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    name: "Bleu vers Violet",
    value: "from-blue-500 to-purple-500",
    preview: "bg-gradient-to-r from-blue-500 to-purple-500",
  },
  {
    name: "Vert vers Bleu",
    value: "from-green-500 to-blue-500",
    preview: "bg-gradient-to-r from-green-500 to-blue-500",
  },
  {
    name: "Rose vers Rouge",
    value: "from-pink-500 to-rose-500",
    preview: "bg-gradient-to-r from-pink-500 to-rose-500",
  },
  {
    name: "Orange vers Rouge",
    value: "from-orange-500 to-red-500",
    preview: "bg-gradient-to-r from-orange-500 to-red-500",
  },
  {
    name: "Turquoise vers Vert",
    value: "from-teal-500 to-green-500",
    preview: "bg-gradient-to-r from-teal-500 to-green-500",
  },
];

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: "",
    description: "",
    iconName: "Settings",
    gradient: "from-purple-500 to-pink-500",
    status: "active",
    baseUrl: "",
    apiKey: "",
    apiKeyHeader: "",
    modelId: "",
    swaggerUrl: "",
    fields: [],
  });
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [deleteConfirmService, setDeleteConfirmService] =
    useState<Service | null>(null);

  // Fetch user services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesApiMethods.getUserServices();
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Impossible de récupérer les services");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for form fields (only for manual services)
  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now() + Math.random(), // Ensure unique ID
      type,
      label: "",
      required: false,
      options: type === "select" ? [""] : undefined,
    };
    setEditFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const updateField = (fieldId: number, updates: Partial<FormField>) => {
    setEditFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    }));
  };

  const removeField = (fieldId: number) => {
    setEditFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }));
  };

  const addSelectOption = (fieldId: number) => {
    setEditFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId
          ? { ...field, options: [...(field.options || []), ""] }
          : field
      ),
    }));
  };

  const updateSelectOption = (
    fieldId: number,
    optionIndex: number,
    value: string
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options?.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : field
      ),
    }));
  };

  const removeSelectOption = (fieldId: number, optionIndex: number) => {
    setEditFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options?.filter((_, idx) => idx !== optionIndex),
            }
          : field
      ),
    }));
  };

  // Handle edit service
  const handleEditService = (service: Service) => {
    setEditingService(service);

    // Parse fields from jsonSchema if it's a manual service
    let fields: FormField[] = [];
    if (service.type === "manual" && service.jsonSchema) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const schema = service.jsonSchema as any;
        if (schema.properties) {
          fields = Object.entries(schema.properties).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ([key, prop]: [string, any], index) => {
              // Determine field type based on schema property
              let fieldType: FormField["type"] = "text";
              if (prop.format === "data-url") {
                fieldType = "file";
              } else if (prop.type === "integer" || prop.type === "number") {
                fieldType = "number";
              } else if (prop.enum && Array.isArray(prop.enum)) {
                fieldType = "select";
              } else if (
                prop.format === "date" ||
                prop.format === "date-time"
              ) {
                fieldType = "date";
              }

              return {
                id: index + 1,
                type: fieldType,
                label: prop.title || key.charAt(0).toUpperCase() + key.slice(1),
                required: schema.required?.includes(key) || false,
                options: fieldType === "select" ? prop.enum : undefined,
              };
            }
          );
        }
      } catch (error) {
        console.warn("Failed to parse service schema:", error);
        // If parsing fails, start with empty fields
        fields = [];
      }
    }

    setEditFormData({
      title: service.title,
      description: service.description,
      iconName: service.iconName,
      gradient: service.gradient,
      status: service.status,
      baseUrl: service.baseUrl || "",
      apiKey: service.apiKey || "",
      apiKeyHeader: service.apiKeyHeader || "",
      modelId: service.modelId || "",
      swaggerUrl: service.swaggerUrl || "",
      fields,
    });
  };

  // Fetch available models from OpenAI-compatible API
  const fetchModels = async () => {
    if (!editFormData.baseUrl.trim()) {
      toast.error("Veuillez saisir l'URL de base");
      return;
    }

    setIsFetchingModels(true);
    try {
      const models = await servicesApiMethods.fetchModels(
        editFormData.baseUrl,
        editFormData.apiKey || undefined,
        editFormData.apiKeyHeader || undefined
      );
      
      const modelIds = models.map(model => model.id);
      setAvailableModels(modelIds);
      
      if (modelIds.length === 0) {
        toast.error("Aucun modèle trouvé");
      } else {
        toast.success(`${modelIds.length} modèle(s) trouvé(s)`);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Impossible de récupérer les modèles. Vérifiez que l'API est compatible OpenAI.");
      setAvailableModels([]);
    } finally {
      setIsFetchingModels(false);
    }
  };

  // Handle update service
  const handleUpdateService = async () => {
    if (!editingService) return;

    try {
      const updateData: UpdateServiceRequest = {
        title: editFormData.title,
        description: editFormData.description,
        iconName: editFormData.iconName,
        gradient: editFormData.gradient,
        status: editFormData.status,
        modelId: editFormData.modelId,
      };

      // Add type-specific fields
      if (editingService.type === "manual") {
        updateData.baseUrl = editFormData.baseUrl;
        updateData.apiKey = editFormData.apiKey;
        updateData.apiKeyHeader = editFormData.apiKeyHeader;
        // For manual services, we'd need to regenerate the JSON schema from fields
        // This is simplified - you might want to implement the schema generator
      } else if (editingService.type === "automatic") {
        // For automatic services, you might want to add swagger URL update logic
      }

      const response = await servicesApiMethods.updateService(
        editingService._id,
        updateData
      );

      // Update local state
      setServices((prev) =>
        prev.map((service) =>
          service._id === editingService._id
            ? { ...service, ...response.data }
            : service
        )
      );

      setEditingService(null);
      toast.success("Service mis à jour avec succès !");
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Impossible de mettre à jour le service");
    }
  };

  // Handle delete service
  const handleDeleteService = async (service: Service) => {
    try {
      await servicesApiMethods.deleteService(service._id);
      setServices((prev) => prev.filter((s) => s._id !== service._id));
      setDeleteConfirmService(null);
      toast.success("Service supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Impossible de supprimer le service");
    }
  };

  // Utility functions
  const getServiceIcon = (iconName: string) => {
    const iconData = availableIcons.find((icon) => icon.name === iconName);
    const IconComponent = iconData ? iconData.icon : Settings;
    return <IconComponent className="w-8 h-8" />;
  };

  const getFieldIcon = (type: FormField["type"]) => {
    switch (type) {
      case "file":
        return <Upload className="w-4 h-4" />;
      case "text":
        return <Type className="w-4 h-4" />;
      case "number":
        return <Hash className="w-4 h-4" />;
      case "date":
        return <Calendar className="w-4 h-4" />;
      case "select":
        return <ToggleLeft className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  // Filter services based on search
  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter icons based on search
  const filteredIcons = availableIcons.filter(
    (icon) =>
      icon.name.toLowerCase().includes(iconSearchTerm.toLowerCase()) ||
      icon.label.toLowerCase().includes(iconSearchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Chargement de vos services...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
        {/* Header */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gérer mes services</h1>
              <p className="text-muted-foreground">
                Modifiez, mettez à jour ou supprimez vos services
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Rechercher vos services..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="container mx-auto px-4 pb-16">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Aucun service trouvé
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? "Aucun service ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore créé de services."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card
                  key={service._id}
                  className="bg-card border-border hover:bg-accent/50 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.gradient} flex items-center justify-center text-white`}
                      >
                        {getServiceIcon(service.iconName)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmService(service)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            service.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {service.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {service.type === "automatic" ? (
                          <Bot className="w-3 h-3" />
                        ) : (
                          <Settings className="w-3 h-3" />
                        )}
                        {service.type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Edit Service Modal */}
        <Modal
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          title={`Modifier le service : ${editingService?.title}`}
        >
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations générales</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom du service
                </label>
                <Input
                  placeholder="Ex: Convertisseur PDF"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Décrivez ce que fait votre service..."
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Type-specific fields */}
            {editingService?.type === "manual" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Configuration de l'API
                </h3>
                
                <p className="text-sm text-muted-foreground">
                  Votre service doit être compatible avec l'API OpenAI
                </p>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    URL de base
                  </label>
                  <Input
                    placeholder="http://localhost:1234"
                    value={editFormData.baseUrl}
                    onChange={(e) => {
                      setEditFormData((prev) => ({
                        ...prev,
                        baseUrl: e.target.value,
                      }));
                      // Reset available models when base URL changes
                      setAvailableModels([]);
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL de base de votre service compatible OpenAI
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Clé API
                  </label>
                  <Input
                    type="password"
                    placeholder="Votre clé API"
                    value={editFormData.apiKey}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        apiKey: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    En-tête de la clé API
                  </label>
                  <Input
                    placeholder="Authorization"
                    value={editFormData.apiKeyHeader}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        apiKeyHeader: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Modèles disponibles
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={fetchModels}
                      disabled={isFetchingModels || !editFormData.baseUrl.trim()}
                      className="flex items-center gap-2"
                    >
                      {isFetchingModels ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      Récupérer les modèles
                    </Button>
                  </div>
                  
                  {availableModels.length > 0 ? (
                    <select
                      className="w-full bg-muted border border-border rounded-md px-3 py-2 text-foreground"
                      value={editFormData.modelId}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          modelId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Sélectionnez un modèle</option>
                      {availableModels.map((modelId) => (
                        <option key={modelId} value={modelId}>
                          {modelId}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md border border-dashed">
                      Cliquez sur "Récupérer les modèles" pour charger les modèles disponibles
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {availableModels.length > 0
                      ? "Sélectionnez un modèle dans la liste"
                      : "Vous devez récupérer les modèles avant de pouvoir mettre à jour le service"}
                  </p>
                </div>
              </div>
            )}

            {editingService?.type === "automatic" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configuration Swagger</h3>
                
                <p className="text-sm text-muted-foreground">
                  Votre service doit être compatible avec l'API OpenAI
                </p>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    URL Swagger
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://api.example.com/swagger.json"
                      value={editFormData.swaggerUrl}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          swaggerUrl: e.target.value,
                        }))
                      }
                    />
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Icône du service
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${editFormData.gradient} flex items-center justify-center text-white`}
                  >
                    {React.createElement(
                      availableIcons.find(
                        (icon) => icon.name === editFormData.iconName
                      )?.icon || Settings,
                      { className: "w-6 h-6" }
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher des icônes..."
                      value={iconSearchTerm}
                      onChange={(e) => setIconSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto border border-border rounded-md p-3">
                  {filteredIcons.map((iconData) => {
                    const IconComponent = iconData.icon;
                    return (
                      <button
                        key={iconData.name}
                        type="button"
                        className={`p-2 rounded-md border-2 transition-all hover:bg-accent ${
                          editFormData.iconName === iconData.name
                            ? "border-purple-500 bg-accent"
                            : "border-transparent"
                        }`}
                        onClick={() =>
                          setEditFormData((prev) => ({
                            ...prev,
                            iconName: iconData.name,
                          }))
                        }
                        title={iconData.label}
                      >
                        <IconComponent className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Gradient Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Thème de couleur
              </label>
              <div className="grid grid-cols-3 gap-3">
                {availableGradients.map((gradient) => (
                  <button
                    key={gradient.value}
                    type="button"
                    className={`p-3 rounded-lg border-2 transition-all ${
                      editFormData.gradient === gradient.value
                        ? "border-white ring-2 ring-purple-500"
                        : "border-transparent"
                    }`}
                    onClick={() =>
                      setEditFormData((prev) => ({
                        ...prev,
                        gradient: gradient.value,
                      }))
                    }
                    title={gradient.name}
                  >
                    <div
                      className={`w-full h-8 rounded ${gradient.preview}`}
                    ></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={editFormData.status === "active"}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        status: e.target.value as "active" | "inactive",
                      }))
                    }
                    className="text-green-500"
                  />
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Actif
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={editFormData.status === "inactive"}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        status: e.target.value as "active" | "inactive",
                      }))
                    }
                    className="text-red-500"
                  />
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Inactif
                  </span>
                </label>
              </div>
            </div>

            {/* Form Fields for Manual Services */}
            {editingService?.type === "manual" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Champs du formulaire
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addField("file")}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Fichier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addField("text")}
                    >
                      <Type className="w-4 h-4 mr-1" />
                      Texte
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addField("number")}
                    >
                      <Hash className="w-4 h-4 mr-1" />
                      Nombre
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addField("select")}
                    >
                      <ToggleLeft className="w-4 h-4 mr-1" />
                      Liste
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {editFormData.fields.map((field) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded bg-muted flex-shrink-0">
                          {getFieldIcon(field.type)}
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 gap-2">
                            <Input
                              placeholder="Label du champ (ex: Fichier à traiter)"
                              value={field.label}
                              onChange={(e) =>
                                updateField(field.id, { label: e.target.value })
                              }
                            />
                          </div>

                          {field.type === "select" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">
                                  Options
                                </label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addSelectOption(field.id)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {field.options?.map((option, idx) => (
                                  <div key={idx} className="flex gap-2">
                                    <Input
                                      placeholder={`Option ${idx + 1}`}
                                      value={option}
                                      onChange={(e) =>
                                        updateSelectOption(
                                          field.id,
                                          idx,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeSelectOption(field.id, idx)
                                      }
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`required-${field.id}`}
                              checked={field.required}
                              onChange={(e) =>
                                updateField(field.id, {
                                  required: e.target.checked,
                                })
                              }
                              className="rounded w-4 h-4"
                            />
                            <label
                              htmlFor={`required-${field.id}`}
                              className="text-sm"
                            >
                              Champ obligatoire
                            </label>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(field.id)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}

                  {editFormData.fields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>
                        Aucun champ ajouté. Utilisez les boutons ci-dessus pour
                        ajouter des champs de formulaire.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <Button variant="outline" onClick={() => setEditingService(null)}>
                Annuler
              </Button>
              <Button
                onClick={handleUpdateService}
                disabled={
                  !editFormData.title ||
                  !editFormData.description ||
                  !editFormData.modelId
                }
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Mettre à jour le service
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteConfirmService}
          onClose={() => setDeleteConfirmService(null)}
          title="Supprimer le service"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Êtes-vous sûr ?</h3>
                <p className="text-muted-foreground">
                  Cette action ne peut pas être annulée. Cela supprimera
                  définitivement le service "{deleteConfirmService?.title}".
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmService(null)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  deleteConfirmService &&
                  handleDeleteService(deleteConfirmService)
                }
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer le service
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
