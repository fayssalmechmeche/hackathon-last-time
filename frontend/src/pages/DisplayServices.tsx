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
import {
  FileImage,
  FileText,
  ImageIcon,
  Video,
  Music,
  Zap,
  Database,
  Palette,
  Search,
  ArrowRight,
} from "lucide-react";

export default function DisplayServices() {
  const services = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "PDF Tools",
      description:
        "Convertir PDF en PNG, JPG, Word ou compresser vos fichiers PDF",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: <ImageIcon className="w-8 h-8" />,
      title: "Image Tools",
      description:
        "Compresser, redimensionner, convertir vos images en différents formats",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Tools",
      description: "Compresser vidéos, extraire audio, convertir formats vidéo",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Audio Tools",
      description:
        "Convertir MP3, WAV, compresser fichiers audio, extraire son",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Quick Convert",
      description:
        "Conversion rapide entre tous formats de fichiers populaires",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Design Tools",
      description:
        "Créer logos, bannières, redimensionner pour réseaux sociaux",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Tools",
      description:
        "Convertir CSV, Excel, JSON, nettoyer et organiser vos données",
      gradient: "from-teal-500 to-green-500",
    },
    {
      icon: <FileImage className="w-8 h-8" />,
      title: "Document Tools",
      description:
        "Fusionner, diviser, protéger vos documents et présentations",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      {/* <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold">Hapijobs</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Find Jobs
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                For Jobs Seekers
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                For Company
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Log In
            </Button>
            <Button className="bg-white text-gray-900 hover:bg-gray-100">
              Sign Up
            </Button>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Choisissez votre service
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Notre IA intelligente comprend vos besoins, identifie les meilleurs
          outils et vous propose une feuille de route personnalisée.
        </p>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg">
          Déposer mon service
        </Button>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group cursor-pointer"
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher par nom d'outil, catégorie ou fonction..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Select>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
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
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="convert">Convertir</SelectItem>
              <SelectItem value="compress">Compresser</SelectItem>
              <SelectItem value="edit">Éditer</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
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
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              8M<span className="text-green-500">+</span>
            </div>
            <div className="text-gray-400 text-sm">Fichiers traités</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              150K<span className="text-green-500">+</span>
            </div>
            <div className="text-gray-400 text-sm">Utilisateurs satisfaits</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              10M<span className="text-green-500">+</span>
            </div>
            <div className="text-gray-400 text-sm">Conversions réussies</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              24/7
            </div>
            <div className="text-gray-400 text-sm">Support disponible</div>
          </div>
        </div>
      </section>
    </div>
  );
}
