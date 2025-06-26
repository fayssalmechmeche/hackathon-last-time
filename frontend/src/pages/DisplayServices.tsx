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
} from "lucide-react";
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

export default function DisplayServices() {
  const navigate = useNavigate();

  const mockServices = [
    {
      id: "pdf-tools",
      icon: <FileText className="w-8 h-8" />,
      title: "PDF Tools",
      description:
        "Convertir PDF en PNG, JPG, Word ou compresser vos fichiers PDF",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: "image-tools",
      icon: <ImageIcon className="w-8 h-8" />,
      title: "Image Tools",
      description:
        "Compresser, redimensionner, convertir vos images en différents formats",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      id: "video-tools",
      icon: <Video className="w-8 h-8" />,
      title: "Video Tools",
      description: "Compresser vidéos, extraire audio, convertir formats vidéo",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "audio-tools",
      icon: <Music className="w-8 h-8" />,
      title: "Audio Tools",
      description:
        "Convertir MP3, WAV, compresser fichiers audio, extraire son",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "quick-convert",
      icon: <Zap className="w-8 h-8" />,
      title: "Quick Convert",
      description:
        "Conversion rapide entre tous formats de fichiers populaires",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: "design-tools",
      icon: <Palette className="w-8 h-8" />,
      title: "Design Tools",
      description:
        "Créer logos, bannières, redimensionner pour réseaux sociaux",
      gradient: "from-red-500 to-pink-500",
    },
    {
      id: "data-tools",
      icon: <Database className="w-8 h-8" />,
      title: "Data Tools",
      description:
        "Convertir CSV, Excel, JSON, nettoyer et organiser vos données",
      gradient: "from-teal-500 to-green-500",
    },
    {
      id: "document-tools",
      icon: <FileImage className="w-8 h-8" />,
      title: "Document Tools",
      description:
        "Fusionner, diviser, protéger vos documents et présentations",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

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
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg">
            Déposer mon service
          </Button>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockServices.map((service, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group cursor-pointer"
                onClick={() => handleServiceClick(service.id)}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 text-white`}
                  >
                    {service.icon}
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
                      handleServiceClick(service.id);
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
