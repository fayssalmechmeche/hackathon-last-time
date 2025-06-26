import {
  ArrowRight,
  Database,
  FileImage,
  FileText,
  ImageIcon,
  Music,
  Palette,
  Search,
  Video,
  Zap,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { servicesApiMethods, type ServiceResponse } from "../lib/api";

export default function DisplayServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mappage des icônes par nom
  const iconMap: Record<string, React.ReactElement> = {
    FileText: <FileText className="w-8 h-8" />,
    ImageIcon: <ImageIcon className="w-8 h-8" />,
    Video: <Video className="w-8 h-8" />,
    Music: <Music className="w-8 h-8" />,
    Zap: <Zap className="w-8 h-8" />,
    Palette: <Palette className="w-8 h-8" />,
    Database: <Database className="w-8 h-8" />,
    FileImage: <FileImage className="w-8 h-8" />,
  };

  const getIconForService = (iconName: string) => {
    return iconMap[iconName] || <FileText className="w-8 h-8" />;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await servicesApiMethods.getActiveServices();
        setServices(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
        setError("Impossible de charger les services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  // Gestion de l'état de chargement
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              Chargement des services...
            </h1>
          </div>
        </div>
      </Layout>
    );
  }

  // Gestion de l'état d'erreur
  if (error) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{error}</h1>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Nos services</h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Explorez notre écosystème complet d'outils numériques. Que vous ayez
            besoin de convertir, compresser, éditer ou créer, trouvez la
            solution parfaite sur Nexolve.
          </p>
          <p className="text-muted-foreground text-base max-w-lg mx-auto mb-6">
            Vous souhaitez intégrer votre propre service à Nexolve ?
          </p>
          <Link to="/services/list">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg">
              Déposer mon service
            </Button>
          </Link>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card
                key={service._id}
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group cursor-pointer"
                onClick={() => handleServiceClick(service._id)}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 text-white`}
                  >
                    {getIconForService(service.iconName)}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 flex items-center justify-between">
                    {service.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {service.description}
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white border-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceClick(service._id);
                    }}
                  >
                    Sélectionner ce service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Explore Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Explorer nos outils
          </h2>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Rechercher par nom d'outil, catégorie ou fonction..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Vidéo</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="convert">Convertir</SelectItem>
                <SelectItem value="compress">Compresser</SelectItem>
                <SelectItem value="edit">Éditer</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="mp4">MP4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                8M<span className="text-green-500">+</span>
              </div>
              <div className="text-muted-foreground text-sm">
                Fichiers traités
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                150K<span className="text-green-500">+</span>
              </div>
              <div className="text-muted-foreground text-sm">
                Utilisateurs satisfaits
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                10M<span className="text-green-500">+</span>
              </div>
              <div className="text-muted-foreground text-sm">
                Conversions réussies
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                24/7
              </div>
              <div className="text-muted-foreground text-sm">
                Support disponible
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
