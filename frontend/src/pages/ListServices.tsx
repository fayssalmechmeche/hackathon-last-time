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
  CornerDownRight,
  ChevronDown,
  ChevronRight,
  MoreVertical,
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
  ArrowRight,
  Loader2,
  Minus, // Added for removing body fields
  CornerRightDown, // Added for sub-inputs
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import {
  servicesApiMethods,
  type CreateAutomatedServiceRequest,
  type CreateManualServiceRequest,
  type ServiceResponse,
} from "../lib/api";

interface Service {
  _id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  status: "active" | "inactive";
  type: "automatic" | "manual";
  swaggerUrl?: string;
  fields?: FormField[];
  iconName?: string;
  endpointUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  jsonSchema?: object;
}

interface FormField {
  id: number;
  type: "file" | "text" | "number" | "date" | "select" | "object"; // Added 'object' type for nested fields
  label: string;
  required: boolean;
  options?: string[];
  children?: FormField[]; // Added for nested fields
  expanded?: boolean; // Nouveau: pour gérer l'état d'expansion
}

interface FormData {
  title: string;
  description: string;
  swaggerUrl: string;
  endpointUrl: string;
  apiKey: string;
  apiKeyHeader: string;
  fields: FormField[];
  iconName: string;
  status: "active" | "inactive";
  gradient: string;
  bodyStructure: FormField[];
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

const NestedField: React.FC<{
  field: FormField;
  onUpdate: (updatedField: FormField) => void;
  onRemove: () => void;
  onAddChild: (type: FormField["type"]) => void;
  depth: number;
}> = ({ field, onUpdate, onRemove, onAddChild, depth }) => {
  const toggleExpand = () => {
    onUpdate({ ...field, expanded: !field.expanded });
  };

  return (
    <div className="mb-3 border border-gray-700 rounded-lg overflow-hidden">
      <div
        className={`flex items-center p-3 ${
          depth === 0 ? "bg-gray-800" : "bg-gray-900"
        }`}
      >
        <button
          onClick={toggleExpand}
          className="mr-2 text-gray-400 hover:text-white"
        >
          {field.type === "object" && field.children?.length ? (
            field.expanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )
          ) : (
            <span className="w-4 block"></span>
          )}
        </button>

        <div className="flex-grow grid grid-cols-12 gap-2 items-center">
          <div className="col-span-3">
            <select
              value={field.type}
              onChange={(e) =>
                onUpdate({
                  ...field,
                  type: e.target.value as FormField["type"],
                })
              }
              className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              <option value="text">Texte</option>
              <option value="number">Nombre</option>
              <option value="file">Fichier</option>
              <option value="date">Date</option>
              <option value="select">Sélection</option>
              <option value="object">Objet</option>
            </select>
          </div>

          <div className="col-span-5">
            <input
              type="text"
              placeholder="Nom du champ"
              value={field.label}
              onChange={(e) => onUpdate({ ...field, label: e.target.value })}
              className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
            />
          </div>

          <div className="col-span-2 flex items-center">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) =>
                onUpdate({ ...field, required: e.target.checked })
              }
              className="mr-1"
            />
            <span className="text-xs text-gray-300">Requis</span>
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-300"
            >
              <Minus size={16} />
            </button>
          </div>
        </div>
      </div>

      {field.type === "select" && (
        <div className="p-3 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-300 mr-3">
              Options:
            </span>
            <button
              onClick={() =>
                onUpdate({
                  ...field,
                  options: [...(field.options || []), ""],
                })
              }
              className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
            >
              + Ajouter
            </button>
          </div>

          {field.options?.map((option, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                value={option}
                onChange={(e) => {
                  const newOptions = [...(field.options || [])];
                  newOptions[idx] = e.target.value;
                  onUpdate({ ...field, options: newOptions });
                }}
                className="flex-grow bg-gray-700 text-white rounded px-2 py-1 text-sm mr-2"
                placeholder={`Option ${idx + 1}`}
              />
              <button
                onClick={() => {
                  const newOptions = [...(field.options || [])];
                  newOptions.splice(idx, 1);
                  onUpdate({ ...field, options: newOptions });
                }}
                className="text-red-500 hover:text-red-300"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {field.type === "object" && field.expanded && (
        <div className="p-3 bg-gray-900 border-t border-gray-800">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => onAddChild("text")}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded flex items-center"
            >
              <Plus size={12} className="mr-1" /> Texte
            </button>
            <button
              onClick={() => onAddChild("number")}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded flex items-center"
            >
              <Plus size={12} className="mr-1" /> Nombre
            </button>
            <button
              onClick={() => onAddChild("object")}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded flex items-center"
            >
              <Plus size={12} className="mr-1" /> Objet
            </button>
            {/* Ajouter d'autres types au besoin */}
          </div>

          {field.children?.map((child, index) => (
            <div
              key={child.id}
              className="ml-4 border-l-2 border-gray-700 pl-3"
            >
              <NestedField
                field={child}
                onUpdate={(updatedChild) => {
                  const newChildren = [...(field.children || [])];
                  newChildren[index] = updatedChild;
                  onUpdate({ ...field, children: newChildren });
                }}
                onRemove={() => {
                  const newChildren = [...(field.children || [])];
                  newChildren.splice(index, 1);
                  onUpdate({ ...field, children: newChildren });
                }}
                onAddChild={(type) => {
                  const newChild: FormField = {
                    id: Date.now(),
                    type,
                    label: "",
                    required: false,
                    expanded: true,
                  };
                  onUpdate({
                    ...field,
                    children: [...(field.children || []), newChild],
                  });
                }}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour gérer la sélection d'un service
  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  // Fonction pour convertir ServiceResponse en Service avec icône
  const convertServiceResponseToService = (
    serviceResponse: ServiceResponse
  ): Service => {
    const selectedIcon = availableIcons.find(
      (icon) => icon.name === serviceResponse.iconName
    );
    const IconComponent = selectedIcon ? selectedIcon.icon : Settings;

    return {
      ...serviceResponse,
      icon: <IconComponent className="w-8 h-8" />,
    };
  };

  // Charger les services actifs au montage du composant
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const response = await servicesApiMethods.getActiveServices();
        const servicesWithIcons = response.data.map(
          convertServiceResponseToService
        );
        setServices(servicesWithIcons);
      } catch (error) {
        console.error("Error loading services:", error);
        toast.error("Erreur lors du chargement des services");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

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
    apiKey: "",
    apiKeyHeader: "",
    fields: [],
    iconName: "Settings",
    status: "active",
    gradient: "from-purple-500 to-pink-500",
    bodyStructure: [], // Initialize bodyStructure
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [numberOfRoutes, setNumberOfRoutes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwaggerGood, setIsSwaggerGood] = useState(false);
  const [routes, setRoutes] = useState<string[]>([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [host, setHost] = useState("");

  const handleAddService = () => {
    setIsModalOpen(true);
    setModalStep(1);
    setServiceType("");
    setFormData({
      title: "",
      description: "",
      swaggerUrl: "",
      endpointUrl: "",
      apiKey: "",
      apiKeyHeader: "",
      fields: [],
      iconName: "Settings",
      status: "active",
      gradient: "from-purple-500 to-pink-500",
      bodyStructure: [], // Reset bodyStructure
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

  const addBodySelectOption = (
    fieldId: number,
    fields: FormField[]
  ): FormField[] => {
    return fields.map((field) => {
      if (field.id === fieldId) {
        return { ...field, options: [...(field.options || []), ""] };
      }
      if (field.children) {
        return {
          ...field,
          children: addBodySelectOption(fieldId, field.children),
        };
      }
      return field;
    });
  };

  const updateBodySelectOption = (
    fieldId: number,
    optionIndex: number,
    value: string,
    fields: FormField[]
  ): FormField[] => {
    return fields.map((field) => {
      if (field.id === fieldId) {
        return {
          ...field,
          options: field.options?.map((opt, idx) =>
            idx === optionIndex ? value : opt
          ),
        };
      }
      if (field.children) {
        return {
          ...field,
          children: updateBodySelectOption(
            fieldId,
            optionIndex,
            value,
            field.children
          ),
        };
      }
      return field;
    });
  };

  const removeBodySelectOption = (
    fieldId: number,
    optionIndex: number,
    fields: FormField[]
  ): FormField[] => {
    return fields.map((field) => {
      if (field.id === fieldId) {
        return {
          ...field,
          options: field.options?.filter((_, idx) => idx !== optionIndex),
        };
      }
      if (field.children) {
        return {
          ...field,
          children: removeBodySelectOption(
            fieldId,
            optionIndex,
            field.children
          ),
        };
      }
      return field;
    });
  };

  const renderBodyField = (field: FormField, indentLevel: number = 0) => (
    <div
      key={field.id}
      className={`flex items-start gap-2 mb-4 p-3 rounded-md border border-dashed border-gray-700 bg-gray-800 ${
        indentLevel > 0 ? "ml-" + indentLevel * 4 : ""
      }`}
    >
      <div className="flex-grow space-y-2">
        <div className="flex items-center gap-2">
          {indentLevel > 0 && (
            <CornerRightDown className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-sm font-medium text-white flex-shrink-0 w-24">
            {getFieldIcon(field.type)} {field.type.toUpperCase()}
          </span>
          <Input
            placeholder="Label du champ"
            value={field.label}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                bodyStructure: updateBodyField(
                  field.id,
                  { label: e.target.value },
                  prev.bodyStructure
                ),
              }))
            }
            className="flex-grow"
          />
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bodyStructure: updateBodyField(
                    field.id,
                    { required: e.target.checked },
                    prev.bodyStructure
                  ),
                }))
              }
              className="form-checkbox text-purple-600"
            />
            Requis
          </label>
          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                bodyStructure: removeBodyField(field.id, prev.bodyStructure),
              }))
            }
            className="flex-shrink-0"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        {field.type === "select" && (
          <div className="ml-8 space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Options:</h4>
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  placeholder={`Option ${idx + 1}`}
                  value={option}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bodyStructure: updateBodySelectOption(
                        field.id,
                        idx,
                        e.target.value,
                        prev.bodyStructure
                      ),
                    }))
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      bodyStructure: removeBodySelectOption(
                        field.id,
                        idx,
                        prev.bodyStructure
                      ),
                    }))
                  }
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  bodyStructure: addBodySelectOption(
                    field.id,
                    prev.bodyStructure
                  ),
                }))
              }
            >
              Ajouter une option
            </Button>
          </div>
        )}

        {field.type === "object" && (
          <div className="ml-8 space-y-2 p-2 border-l border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Sous-champs:
            </h4>
            {field.children?.map((childField) =>
              renderBodyField(childField, indentLevel + 1)
            )}
            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addBodyField("text", field.id)}
              >
                <Plus className="w-4 h-4 mr-2" /> Texte
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addBodyField("number", field.id)}
              >
                <Plus className="w-4 h-4 mr-2" /> Nombre
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addBodyField("object", field.id)}
              >
                <Plus className="w-4 h-4 mr-2" /> Objet
              </Button>
              {/* Add other types as needed for sub-fields */}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const addBodyField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now(),
      type,
      label: "",
      required: false,
      expanded: type === "object", // Auto-expand les objets
    };

    setFormData((prev) => ({
      ...prev,
      bodyStructure: [...prev.bodyStructure, newField],
    }));
  };

  const updateBodyField = (index: number, updatedField: FormField) => {
    setFormData((prev) => {
      const newStructure = [...prev.bodyStructure];
      newStructure[index] = updatedField;
      return { ...prev, bodyStructure: newStructure };
    });
  };

  const removeBodyField = (index: number) => {
    setFormData((prev) => {
      const newStructure = [...prev.bodyStructure];
      newStructure.splice(index, 1);
      return { ...prev, bodyStructure: newStructure };
    });
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
          apiKey: formData.apiKey,
          apiKeyHeader: formData.apiKeyHeader,
          fields: formData.fields,
          bodyStructure: formData.bodyStructure, // Include bodyStructure
        };

        await servicesApiMethods.createManualService(serviceData);

        // Recharger tous les services depuis l'API
        const response = await servicesApiMethods.getActiveServices();
        const servicesWithIcons = response.data.map(
          convertServiceResponseToService
        );
        setServices(servicesWithIcons);

        setIsModalOpen(false);

        // Reset form
        setFormData({
          title: "",
          description: "",
          swaggerUrl: "",
          endpointUrl: "",
          apiKey: "",
          apiKeyHeader: "",
          fields: [],
          iconName: "Settings",
          status: "active",
          gradient: "from-purple-500 to-pink-500",
          bodyStructure: [],
        });

        // Show success message
        toast.success("Service créé avec succès");
      } else if (serviceType === "automatic") {
        if (isSwaggerGood) {
          // For automatic services
          const newServiceData: CreateAutomatedServiceRequest = {
            title: formData.title,
            description: formData.description,
            iconName: formData.iconName,
            gradient: formData.gradient,
            status: formData.status,
            swaggerUrl: formData.swaggerUrl,
            endpointUrl: "https://" + host + "/" + selectedRoute,
          };

          await servicesApiMethods.createAutomatedService(newServiceData);

          // Recharger tous les services depuis l'API
          const response = await servicesApiMethods.getActiveServices();
          const servicesWithIcons = response.data.map(
            convertServiceResponseToService
          );
          setServices(servicesWithIcons);

          setIsModalOpen(false);
          toast.success("Service créé avec succès");

          // Reset form
          setFormData({
            title: "",
            description: "",
            swaggerUrl: "",
            endpointUrl: "",
            apiKey: "",
            apiKeyHeader: "",
            fields: [],
            iconName: "Settings",
            status: "active",
            gradient: "from-purple-500 to-pink-500",
            bodyStructure: [],
          });
        } else {
          toast.error(
            "Veuillez vérifier l'URL du swagger avant de créer le service"
          );
        }
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Erreur lors de la création du service. Veuillez réessayer.");
    }
  };

  const handleAnalyzeSwagger = async () => {
    // call api to analyze swagger if service has endpoint in his swagger
    if (formData.swaggerUrl && serviceType === "automatic") {
      setIsLoading(true);
      const response = await servicesApiMethods.analyzeSwagger(
        formData.swaggerUrl
      );
      setHost(response.data.host);

      // check if the response has a routes property with a properties object
      console.log(response.data.properties.routes.properties);
      if (
        response.status === 201 &&
        response.data.properties.routes &&
        Object.keys(response.data.properties.routes.properties).length == 0
      ) {
        setIsSwaggerGood(true);

        setIsLoading(false);
      } else if (
        response.status === 201 &&
        response.data.properties.routes &&
        Object.keys(response.data.properties.routes.properties).length > 0
      ) {
        setIsSwaggerGood(false);
        setNumberOfRoutes(
          Object.keys(response.data.properties.routes.properties).length
        );
        setRoutes(
          Object.keys(response.data.properties.routes.properties).map(
            (route) => route as string
          )
        );
        setIsLoading(false);
        toast.error(
          `Veuillez sélectionner un endpoint parmi les ${numberOfRoutes} disponibles`
        );
      } else {
        setIsSwaggerGood(false);
        setIsLoading(false);
        toast.error("L'URL du swagger ne contient pas d'endpoint");
      }
    }
  };

  const handleRouteSelect = (selectedRoute: string) => {
    setSelectedRoute(selectedRoute);
    setFormData((prev) => ({
      ...prev,
      endpointUrl: selectedRoute,
    }));
    setIsSwaggerGood(true);
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
      case "object":
        return <Code className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
        {/* Header */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8 gap-5">
            <div>
              <h1 className="text-3xl font-bold mb-2">Services</h1>
              <p className="text-muted-foreground">
                Explorez notre écosystème complet d'outils numériques. Que vous
                ayez besoin de convertir, compresser, éditer ou créer, trouvez
                la solution parfaite.
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Aucun service disponible</p>
                    <p className="text-sm">Commencez par ajouter un service</p>
                  </div>
                </div>
              ) : (
                filteredServices.map((service) => (
                  <Card
                    key={service._id}
                    className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group cursor-pointer"
                    onClick={() => handleServiceClick(service._id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.gradient} flex items-center justify-center text-white`}
                        >
                          {service.icon}
                        </div>
                      </div>

                      <h3 className="text-white font-semibold text-lg mb-2 flex items-center justify-between">
                        {service.title}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              service.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          <span className="text-xs text-gray-400 capitalize">
                            {service.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          {service.type === "automatic" ? (
                            <Bot className="w-3 h-3" />
                          ) : (
                            <Settings className="w-3 h-3" />
                          )}
                          {service.type}
                        </div>
                      </div>

                      <button
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white border-0 h-9 rounded-md px-3 text-sm font-medium transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(service._id);
                        }}
                      >
                        Sélectionner ce service
                      </button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
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
                  Choisissez le type de service à ajouter :
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
                        Créez manuellement les champs du formulaire selon les
                        besoins
                      </p>
                      <div className="flex items-center justify-center text-xs text-muted-foreground">
                        <Settings className="w-3 h-3 mr-1" />
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
                      placeholder="Décrivez votre service en quelques mots..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Icon Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Icône du service
                    </label>
                    <Input
                      placeholder="Rechercher une icône..."
                      value={iconSearchTerm}
                      onChange={(e) => setIconSearchTerm(e.target.value)}
                      className="mb-3"
                    />
                    <div className="grid grid-cols-6 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-2 rounded-md border border-input">
                      {filteredIcons.map((icon) => {
                        const IconComponent = icon.icon;
                        return (
                          <div
                            key={icon.name}
                            className={`flex flex-col items-center p-2 rounded-md cursor-pointer transition-colors ${
                              formData.iconName === icon.name
                                ? "bg-primary/20 text-primary"
                                : "hover:bg-accent/50"
                            }`}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                iconName: icon.name,
                              }))
                            }
                          >
                            <IconComponent className="w-6 h-6 mb-1" />
                            <span className="text-xs text-center truncate w-full">
                              {icon.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gradient Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Couleur du dégradé
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {availableGradients.map((gradient) => (
                        <div
                          key={gradient.name}
                          className={`h-12 rounded-md cursor-pointer border-2 ${
                            gradient.preview
                          } ${
                            formData.gradient === gradient.value
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              gradient: gradient.value,
                            }))
                          }
                        ></div>
                      ))}
                    </div>
                  </div>

                  {serviceType === "automatic" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          URL du Swagger
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ex: https://api.example.com/swagger.json"
                            value={formData.swaggerUrl}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                swaggerUrl: e.target.value,
                              }))
                            }
                          />
                          <Button
                            onClick={handleAnalyzeSwagger}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Search className="mr-2 h-4 w-4" />
                            )}
                            Analyser
                          </Button>
                        </div>
                        {isSwaggerGood && (
                          <p className="text-green-500 text-sm mt-2">
                            Swagger valide ! Vous pouvez créer le service.
                          </p>
                        )}
                        {numberOfRoutes > 0 && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">
                              Sélectionner un endpoint
                            </label>
                            <select
                              value={selectedRoute}
                              onChange={(e) =>
                                handleRouteSelect(e.target.value)
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Choisissez un endpoint</option>
                              {routes.map((route) => (
                                <option key={route} value={route}>
                                  {route}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {serviceType === "manual" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          URL de l'Endpoint
                        </label>
                        <Input
                          placeholder="Ex: https://api.example.com/convert"
                          value={formData.endpointUrl}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              endpointUrl: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Clé API (Optionnel)
                        </label>
                        <Input
                          placeholder="Votre clé API"
                          value={formData.apiKey}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              apiKey: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          En-tête de la clé API (Optionnel)
                        </label>
                        <Input
                          placeholder="Ex: Authorization"
                          value={formData.apiKeyHeader}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              apiKeyHeader: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {/* Dynamic Form Fields for Query Parameters/Headers */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">
                          Champs du formulaire
                        </h3>
                        {formData.fields.map((field) => (
                          <div
                            key={field.id}
                            className="flex items-end gap-2 mb-4"
                          >
                            <div className="flex-grow space-y-2">
                              <label className="block text-sm font-medium text-muted-foreground">
                                Type de champ
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    type: e.target.value as FormField["type"],
                                  })
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="text">Texte</option>
                                <option value="number">Numérique</option>
                                <option value="file">Fichier</option>
                                <option value="date">Date</option>
                                <option value="select">Sélection</option>
                              </select>
                            </div>
                            <div className="flex-grow space-y-2">
                              <label className="block text-sm font-medium text-muted-foreground">
                                Label
                              </label>
                              <Input
                                placeholder="Nom du champ"
                                value={field.label}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    label: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    required: e.target.checked,
                                  })
                                }
                                className="form-checkbox"
                              />
                              Requis
                            </label>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeField(field.id)}
                              className="mb-3"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            {field.type === "select" && (
                              <div className="w-full flex flex-col gap-2 mt-2">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                  Options de sélection:
                                </h4>
                                {field.options?.map((option, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                  >
                                    <Input
                                      value={option}
                                      onChange={(e) =>
                                        updateSelectOption(
                                          field.id,
                                          idx,
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Option ${idx + 1}`}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        removeSelectOption(field.id, idx)
                                      }
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => addSelectOption(field.id)}
                                >
                                  Ajouter une option
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addField("text")}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Texte
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addField("number")}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Nombre
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addField("file")}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Fichier
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addField("date")}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Date
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addField("select")}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Sélection
                          </Button>
                        </div>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Code className="mr-2" />
                          Structure du corps de la requête (Body)
                        </h3>

                        {formData.bodyStructure.length > 0 ? (
                          formData.bodyStructure.map((field, index) => (
                            <NestedField
                              key={field.id}
                              field={field}
                              onUpdate={(updatedField) =>
                                updateBodyField(index, updatedField)
                              }
                              onRemove={() => removeBodyField(index)}
                              onAddChild={(type) => {
                                const newField: FormField = {
                                  id: Date.now(),
                                  type,
                                  label: "",
                                  required: false,
                                  expanded: true,
                                };

                                const updatedField = {
                                  ...field,
                                  children: [
                                    ...(field.children || []),
                                    newField,
                                  ],
                                };

                                updateBodyField(index, updatedField);
                              }}
                              depth={0}
                            />
                          ))
                        ) : (
                          <div className="text-gray-500 text-center py-6 border border-dashed rounded-lg">
                            Aucun champ défini
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addBodyField("text")}
                            className="flex items-center"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Champ Texte
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addBodyField("number")}
                            className="flex items-center"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Champ Numérique
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addBodyField("file")}
                            className="flex items-center"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Champ Fichier
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addBodyField("object")}
                            className="flex items-center"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Objet Imbriqué
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleSaveService}>Créer le service</Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
