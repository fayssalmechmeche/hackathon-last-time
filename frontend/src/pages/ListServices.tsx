import {
  AlertCircle,
  Archive,
  Award,
  Battery,
  Bell,
  Bookmark,
  BookOpen,
  Bot,
  Briefcase,
  Brush,
  Bug,
  Cake,
  Calculator,
  Calendar,
  Camera,
  Car,
  CheckCircle,
  Clock,
  Cloud,
  Code,
  Coffee,
  Compass,
  Copy,
  Cpu,
  Database,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Fish,
  Flag,
  Flower,
  Folder,
  Gamepad2,
  Gift,
  Globe,
  Hash,
  Headphones,
  Heart,
  HelpCircle,
  Home,
  Image,
  Info,
  Key,
  Lightbulb,
  Link,
  Lock,
  Mail,
  Map,
  MapPin,
  MessageSquare,
  Monitor,
  Moon,
  Mountain,
  Music,
  Palette,
  Pen,
  Phone,
  Pizza,
  Plane,
  Plus,
  Rocket,
  Ruler,
  Satellite,
  Save,
  Scissors,
  Search,
  Settings,
  Share,
  Shield,
  Ship,
  ShoppingCart,
  Smartphone,
  Snowflake,
  Star,
  Sun,
  Tag,
  Target,
  Thermometer,
  ToggleLeft,
  Trash2,
  TreePine,
  Trophy,
  Truck,
  Type,
  Umbrella,
  Upload,
  Users,
  Video,
  Volume2,
  Waves,
  Wifi,
  Wrench,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import {
  servicesApiMethods,
  type CreateManualServiceRequest,
} from "../lib/api";

interface Service {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  status: "active" | "inactive";
  type: "automatic" | "manual";
  swaggerUrl?: string;
  fields?: FormField[];
  iconName?: string;
}

interface FormField {
  id: number;
  type: "file" | "text" | "number" | "date" | "select";
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface FormData {
  title: string;
  description: string;
  swaggerUrl: string;
  endpointUrl: string;
  fields: FormField[];
  iconName: string;
  status: "active" | "inactive";
  gradient: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

// Liste des icônes disponibles
const availableIcons = [
  { name: "FileText", icon: FileText, label: "Document" },
  { name: "Image", icon: Image, label: "Image" },
  { name: "Video", icon: Video, label: "Vidéo" },
  { name: "Code", icon: Code, label: "Code" },
  { name: "Database", icon: Database, label: "Base de données" },
  { name: "Cloud", icon: Cloud, label: "Cloud" },
  { name: "Zap", icon: Zap, label: "Énergie" },
  { name: "Globe", icon: Globe, label: "Web" },
  { name: "Lock", icon: Lock, label: "Sécurité" },
  { name: "Mail", icon: Mail, label: "Email" },
  { name: "Phone", icon: Phone, label: "Téléphone" },
  { name: "Music", icon: Music, label: "Musique" },
  { name: "Camera", icon: Camera, label: "Appareil photo" },
  { name: "Palette", icon: Palette, label: "Design" },
  { name: "Cpu", icon: Cpu, label: "Processeur" },
  { name: "Monitor", icon: Monitor, label: "Moniteur" },
  { name: "Smartphone", icon: Smartphone, label: "Smartphone" },
  { name: "Headphones", icon: Headphones, label: "Casque" },
  { name: "Gamepad2", icon: Gamepad2, label: "Jeu" },
  { name: "Car", icon: Car, label: "Voiture" },
  { name: "Plane", icon: Plane, label: "Avion" },
  { name: "Home", icon: Home, label: "Maison" },
  { name: "ShoppingCart", icon: ShoppingCart, label: "Shopping" },
  { name: "Heart", icon: Heart, label: "Cœur" },
  { name: "Star", icon: Star, label: "Étoile" },
  { name: "Coffee", icon: Coffee, label: "Café" },
  { name: "BookOpen", icon: BookOpen, label: "Livre" },
  { name: "Briefcase", icon: Briefcase, label: "Travail" },
  { name: "Users", icon: Users, label: "Utilisateurs" },
  { name: "MessageSquare", icon: MessageSquare, label: "Message" },
  { name: "Bell", icon: Bell, label: "Notification" },
  { name: "Clock", icon: Clock, label: "Temps" },
  { name: "MapPin", icon: MapPin, label: "Localisation" },
  { name: "Wifi", icon: Wifi, label: "WiFi" },
  { name: "Battery", icon: Battery, label: "Batterie" },
  { name: "Volume2", icon: Volume2, label: "Volume" },
  { name: "Sun", icon: Sun, label: "Soleil" },
  { name: "Moon", icon: Moon, label: "Lune" },
  { name: "Thermometer", icon: Thermometer, label: "Température" },
  { name: "Umbrella", icon: Umbrella, label: "Parapluie" },
  { name: "Snowflake", icon: Snowflake, label: "Neige" },
  { name: "Flower", icon: Flower, label: "Fleur" },
  { name: "TreePine", icon: TreePine, label: "Arbre" },
  { name: "Mountain", icon: Mountain, label: "Montagne" },
  { name: "Waves", icon: Waves, label: "Vagues" },
  { name: "Fish", icon: Fish, label: "Poisson" },
  { name: "Bug", icon: Bug, label: "Bug" },
  { name: "Lightbulb", icon: Lightbulb, label: "Idée" },
  { name: "Wrench", icon: Wrench, label: "Outil" },
  { name: "Scissors", icon: Scissors, label: "Ciseaux" },
  { name: "Brush", icon: Brush, label: "Pinceau" },
  { name: "Pen", icon: Pen, label: "Stylo" },
  { name: "Calculator", icon: Calculator, label: "Calculatrice" },
  { name: "Ruler", icon: Ruler, label: "Règle" },
  { name: "Target", icon: Target, label: "Cible" },
  { name: "Award", icon: Award, label: "Récompense" },
  { name: "Trophy", icon: Trophy, label: "Trophée" },
  { name: "Gift", icon: Gift, label: "Cadeau" },
  { name: "Cake", icon: Cake, label: "Gâteau" },
  { name: "Pizza", icon: Pizza, label: "Pizza" },
  { name: "Truck", icon: Truck, label: "Camion" },
  { name: "Ship", icon: Ship, label: "Bateau" },
  { name: "Rocket", icon: Rocket, label: "Fusée" },
  { name: "Satellite", icon: Satellite, label: "Satellite" },
  { name: "Compass", icon: Compass, label: "Boussole" },
  { name: "Map", icon: Map, label: "Carte" },
  { name: "Flag", icon: Flag, label: "Drapeau" },
  { name: "Key", icon: Key, label: "Clé" },
  { name: "Shield", icon: Shield, label: "Bouclier" },
  { name: "Eye", icon: Eye, label: "Œil" },
  { name: "Download", icon: Download, label: "Téléchargement" },
  { name: "Share", icon: Share, label: "Partage" },
  { name: "Copy", icon: Copy, label: "Copie" },
  { name: "Archive", icon: Archive, label: "Archive" },
  { name: "Folder", icon: Folder, label: "Dossier" },
  { name: "Tag", icon: Tag, label: "Tag" },
  { name: "Bookmark", icon: Bookmark, label: "Signet" },
  { name: "CheckCircle", icon: CheckCircle, label: "Succès" },
  { name: "XCircle", icon: XCircle, label: "Erreur" },
  { name: "AlertCircle", icon: AlertCircle, label: "Alerte" },
  { name: "Info", icon: Info, label: "Information" },
  { name: "HelpCircle", icon: HelpCircle, label: "Aide" },
  { name: "Settings", icon: Settings, label: "Paramètres" },
];

// Couleurs de gradient disponibles
const availableGradients = [
  {
    name: "Purple to Pink",
    value: "from-purple-500 to-pink-500",
    preview: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    name: "Blue to Purple",
    value: "from-blue-500 to-purple-500",
    preview: "bg-gradient-to-r from-blue-500 to-purple-500",
  },
  {
    name: "Green to Blue",
    value: "from-green-500 to-blue-500",
    preview: "bg-gradient-to-r from-green-500 to-blue-500",
  },
  {
    name: "Pink to Rose",
    value: "from-pink-500 to-rose-500",
    preview: "bg-gradient-to-r from-pink-500 to-rose-500",
  },
  {
    name: "Indigo to Purple",
    value: "from-indigo-500 to-purple-500",
    preview: "bg-gradient-to-r from-indigo-500 to-purple-500",
  },
  {
    name: "Blue to Cyan",
    value: "from-blue-500 to-cyan-500",
    preview: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  {
    name: "Green to Emerald",
    value: "from-green-500 to-emerald-500",
    preview: "bg-gradient-to-r from-green-500 to-emerald-500",
  },
  {
    name: "Orange to Red",
    value: "from-orange-500 to-red-500",
    preview: "bg-gradient-to-r from-orange-500 to-red-500",
  },
  {
    name: "Yellow to Orange",
    value: "from-yellow-500 to-orange-500",
    preview: "bg-gradient-to-r from-yellow-500 to-orange-500",
  },
  {
    name: "Teal to Green",
    value: "from-teal-500 to-green-500",
    preview: "bg-gradient-to-r from-teal-500 to-green-500",
  },
  {
    name: "Violet to Purple",
    value: "from-violet-500 to-purple-500",
    preview: "bg-gradient-to-r from-violet-500 to-purple-500",
  },
  {
    name: "Cyan to Blue",
    value: "from-cyan-500 to-blue-500",
    preview: "bg-gradient-to-r from-cyan-500 to-blue-500",
  },
];

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => (
  <div
    className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardContent: React.FC<CardProps> = ({
  className = "",
  children,
  ...props
}) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Textarea: React.FC<TextareaProps> = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

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

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      icon: <FileText className="w-8 h-8" />,
      title: "PDF Tools",
      description:
        "Convertir PDF en PNG, JPG, Word ou compresser vos fichiers PDF",
      gradient: "from-pink-500 to-rose-500",
      status: "active",
      type: "automatic",
      iconName: "FileText",
    },
    {
      id: 2,
      icon: <Image className="w-8 h-8" />,
      title: "Image Tools",
      description:
        "Compresser, redimensionner, convertir vos images en différents formats",
      gradient: "from-purple-500 to-indigo-500",
      status: "active",
      type: "manual",
      iconName: "Image",
    },
    {
      id: 3,
      icon: <Video className="w-8 h-8" />,
      title: "Video Tools",
      description: "Compresser vidéos, extraire audio, convertir formats vidéo",
      gradient: "from-blue-500 to-cyan-500",
      status: "inactive",
      type: "automatic",
      iconName: "Video",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [serviceType, setServiceType] = useState<"automatic" | "manual" | "">(
    ""
  );
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    swaggerUrl: "",
    endpointUrl: "",
    fields: [],
    iconName: "Settings",
    status: "active",
    gradient: "from-purple-500 to-pink-500",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [iconSearchTerm, setIconSearchTerm] = useState("");

  const handleAddService = () => {
    setIsModalOpen(true);
    setModalStep(1);
    setServiceType("");
    setFormData({
      title: "",
      description: "",
      swaggerUrl: "",
      endpointUrl: "",
      fields: [],
      iconName: "Settings",
      status: "active",
      gradient: "from-purple-500 to-pink-500",
    });
  };

  const handleServiceTypeSelect = (type: "automatic" | "manual") => {
    setServiceType(type);
    setModalStep(2);
  };

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now(),
      type,
      label: "",
      placeholder: "",
      required: false,
      options: type === "select" ? [""] : undefined,
    };
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const updateField = (fieldId: number, updates: Partial<FormField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    }));
  };

  const removeField = (fieldId: number) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }));
  };

  const addSelectOption = (fieldId: number) => {
    setFormData((prev) => ({
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
    setFormData((prev) => ({
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
    setFormData((prev) => ({
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

  const handleSaveService = async () => {
    try {
      // Only handle manual services for now (as per requirements)
      if (serviceType === "manual") {
        const serviceData: CreateManualServiceRequest = {
          title: formData.title,
          description: formData.description,
          iconName: formData.iconName,
          gradient: formData.gradient,
          status: formData.status,
          endpointUrl: formData.endpointUrl,
          fields: formData.fields,
        };

        const response = await servicesApiMethods.createManualService(
          serviceData
        );

        // Update local state with the created service
        const selectedIcon = availableIcons.find(
          (icon) => icon.name === formData.iconName
        );
        const IconComponent = selectedIcon ? selectedIcon.icon : Settings;

        const newService: Service = {
          id: response.data._id, // Use the UUID from the database
          title: formData.title,
          description: formData.description,
          type: "manual",
          status: formData.status,
          gradient: formData.gradient,
          icon: <IconComponent className="w-8 h-8" />,
          iconName: formData.iconName,
          fields: formData.fields,
        };

        setServices((prev) => [...prev, newService]);
        setIsModalOpen(false);

        // Reset form
        setFormData({
          title: "",
          description: "",
          swaggerUrl: "",
          endpointUrl: "",
          fields: [],
          iconName: "Settings",
          status: "active",
          gradient: "from-purple-500 to-pink-500",
        });

        // Show success message
        toast.success("Service created successfully!");
      } else {
        // For automatic services, keep the old behavior for now
        const selectedIcon = availableIcons.find(
          (icon) => icon.name === formData.iconName
        );
        const IconComponent = selectedIcon ? selectedIcon.icon : Settings;

        const newService: Service = {
          id: Date.now(),
          title: formData.title,
          description: formData.description,
          type: "automatic",
          status: formData.status,
          gradient: formData.gradient,
          icon: <IconComponent className="w-8 h-8" />,
          iconName: formData.iconName,
          swaggerUrl: formData.swaggerUrl,
        };

        setServices((prev) => [...prev, newService]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Failed to create service. Please try again.");
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIcons = availableIcons.filter(
    (icon) =>
      icon.name.toLowerCase().includes(iconSearchTerm.toLowerCase()) ||
      icon.label.toLowerCase().includes(iconSearchTerm.toLowerCase())
  );

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

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
        {/* Header */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes services</h1>
              <p className="text-muted-foreground">
                Administrez vos services Nexolve - Ajoutez, modifiez ou
                supprimez des services
              </p>
            </div>
            <Button
              onClick={handleAddService}
              className="
    bg-gradient-to-r from-purple-500 to-pink-500
    hover:from-purple-600 hover:to-pink-600
    text-white
    w-full sm:w-auto
    px-3 sm:px-4 lg:px-6
    py-2 sm:py-2.5
    text-sm sm:text-base
    font-medium
    rounded-lg
    transition-all duration-200
    flex items-center justify-center
    gap-1 sm:gap-2
    min-h-[40px] sm:min-h-[44px]
  "
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">Ajouter un service</span>
            </Button>
          </div>

          {/* Search */}
          <div className="max-w-md mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Rechercher un service..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="bg-card border-border hover:bg-accent/50 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.gradient} flex items-center justify-center text-white`}
                    >
                      {service.icon}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
        </section>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            modalStep === 1
              ? "Ajouter un service"
              : `Configurer le service (${serviceType})`
          }
        >
          <div className="p-6">
            {modalStep === 1 && (
              <div className="space-y-6">
                <p className="text-muted-foreground mb-6">
                  Choisissez le type de service que vous souhaitez ajouter :
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                    className="cursor-pointer hover:bg-accent/50 transition-all border-2 hover:border-purple-500"
                    onClick={() => handleServiceTypeSelect("automatic")}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4 text-white mx-auto">
                        <Bot className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        Configuration Automatique
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Importez un swagger d'API IA pour générer
                        automatiquement le formulaire
                      </p>
                      <div className="flex items-center justify-center text-xs text-muted-foreground">
                        <Link className="w-3 h-3 mr-1" />
                        Via Swagger/OpenAPI
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer hover:bg-accent/50 transition-all border-2 hover:border-green-500"
                    onClick={() => handleServiceTypeSelect("manual")}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4 text-white mx-auto">
                        <Settings className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        Configuration Manuelle
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Créez manuellement les champs du formulaire selon vos
                        besoins
                      </p>
                      <div className="flex items-center justify-center text-xs text-muted-foreground">
                        <Edit className="w-3 h-3 mr-1" />
                        Personnalisé
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {modalStep === 2 && (
              <div className="space-y-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nom du service
                    </label>
                    <Input
                      placeholder="Ex: Convertisseur PDF"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
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
                    <Textarea
                      placeholder="Décrivez brièvement ce que fait votre service..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Endpoint URL - only for manual services */}
                  {serviceType === "manual" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Endpoint URL
                      </label>
                      <Input
                        placeholder="https://api.example.com/llm-endpoint"
                        value={formData.endpointUrl}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endpointUrl: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        URL de l'API LLM où envoyer les données du formulaire
                      </p>
                    </div>
                  )}

                  {/* Sélection de l'icône */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Icône du service
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${formData.gradient} flex items-center justify-center text-white`}
                        >
                          {React.createElement(
                            availableIcons.find(
                              (icon) => icon.name === formData.iconName
                            )?.icon || Settings,
                            { className: "w-6 h-6" }
                          )}
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="Rechercher une icône..."
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
                                formData.iconName === iconData.name
                                  ? "border-purple-500 bg-accent"
                                  : "border-transparent"
                              }`}
                              onClick={() =>
                                setFormData((prev) => ({
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

                  {/* Sélection du gradient */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Couleur du service
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {availableGradients.map((gradient) => (
                        <button
                          key={gradient.value}
                          type="button"
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.gradient === gradient.value
                              ? "border-white ring-2 ring-purple-500"
                              : "border-transparent"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
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

                  {/* Statut du service */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Statut du service
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={formData.status === "active"}
                          onChange={(e) =>
                            setFormData((prev) => ({
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
                          checked={formData.status === "inactive"}
                          onChange={(e) =>
                            setFormData((prev) => ({
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
                </div>

                {serviceType === "automatic" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        URL du Swagger
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://api.example.com/swagger.json"
                          value={formData.swaggerUrl}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              swaggerUrl: e.target.value,
                            }))
                          }
                        />
                        <Button variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        L'IA analysera automatiquement le swagger pour générer
                        le formulaire
                      </p>
                    </div>
                  </div>
                )}

                {serviceType === "manual" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <h3 className="text-lg sm:text-xl font-semibold">
                        Champs du formulaire
                      </h3>

                      {/* Boutons d'ajout de champs - responsive */}
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addField("file")}
                          className="px-3 sm:px-3 text-xs sm:text-sm"
                        >
                          <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span>Fichier</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addField("text")}
                          className="px-3 sm:px-3 text-xs sm:text-sm"
                        >
                          <Type className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span>Texte</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addField("number")}
                          className="px-3 sm:px-3 text-xs sm:text-sm"
                        >
                          <Hash className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span>Nombre</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addField("select")}
                          className="px-3 sm:px-3 text-xs sm:text-sm"
                        >
                          <ToggleLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span>Liste</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-80 overflow-y-auto">
                      {formData.fields.map((field) => (
                        <Card key={field.id} className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                            {/* Icône du champ */}
                            <div className="flex items-center justify-center w-8 h-8 rounded bg-muted flex-shrink-0 self-start sm:self-auto">
                              {getFieldIcon(field.type)}
                            </div>

                            {/* Contenu principal du champ */}
                            <div className="flex-1 space-y-3">
                              {/* Inputs Label et Placeholder */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Input
                                  placeholder="Label du champ"
                                  value={field.label}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      label: e.target.value,
                                    })
                                  }
                                  className="text-sm sm:text-base"
                                />
                                <Input
                                  placeholder="Placeholder"
                                  value={field.placeholder}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      placeholder: e.target.value,
                                    })
                                  }
                                  className="text-sm sm:text-base"
                                />
                              </div>

                              {/* Options pour les champs select */}
                              {field.type === "select" && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs sm:text-sm font-medium">
                                      Options
                                    </label>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addSelectOption(field.id)}
                                      className="h-7 sm:h-8 px-2 sm:px-3"
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
                                          className="text-sm sm:text-base"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            removeSelectOption(field.id, idx)
                                          }
                                          className="h-9 sm:h-10 w-9 sm:w-10 p-0 flex-shrink-0"
                                        >
                                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Checkbox "Champ obligatoire" */}
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
                                  className="text-xs sm:text-sm select-none"
                                >
                                  Champ obligatoire
                                </label>
                              </div>
                            </div>

                            {/* Bouton de suppression */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeField(field.id)}
                              className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0 self-start"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}

                      {/* Message vide */}
                      {formData.fields.length === 0 && (
                        <div className="text-center py-6 sm:py-8 text-muted-foreground px-4">
                          <p className="text-sm sm:text-base">
                            Aucun champ ajouté. Utilisez les boutons ci-dessus
                            pour ajouter des champs.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-border">
                  <Button variant="outline" onClick={() => setModalStep(1)}>
                    Retour
                  </Button>
                  <Button
                    onClick={handleSaveService}
                    disabled={
                      !formData.title ||
                      !formData.description ||
                      (serviceType === "automatic" && !formData.swaggerUrl)
                    }
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer le service
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
