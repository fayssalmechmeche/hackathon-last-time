import { getDatabase } from "../db/client.js";
import type {
  ServiceDocument,
  ServiceDocumentInsert,
  ServiceDocumentUpdate,
} from "../db/schema.js";

const COLLECTION_NAME = "services";

export async function createService(
  service: ServiceDocumentInsert
): Promise<ServiceDocument> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  const now = new Date();
  const serviceWithTimestamps: ServiceDocument = {
    ...service,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(serviceWithTimestamps);

  if (!result.acknowledged) {
    throw new Error("Failed to create service");
  }

  return serviceWithTimestamps;
}

export async function findServiceById(
  id: string
): Promise<ServiceDocument | null> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  return await collection.findOne({ _id: id });
}

export async function findServicesByUserId(
  userId: string
): Promise<ServiceDocument[]> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  return await collection.find({ createdBy: userId }).toArray();
}

export async function findAllActiveServices(): Promise<ServiceDocument[]> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  return await collection.find({ status: "active" }).toArray();
}

export async function updateService(
  id: string,
  updates: ServiceDocumentUpdate
): Promise<ServiceDocument | null> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  const updatesWithTimestamp = {
    ...updates,
    updatedAt: new Date(),
  };

  const result = await collection.findOneAndUpdate(
    { _id: id },
    { $set: updatesWithTimestamp },
    { returnDocument: "after" }
  );

  return result || null;
}

export async function deleteService(id: string): Promise<boolean> {
  const db = getDatabase();
  const collection = db.collection<ServiceDocument>(COLLECTION_NAME);

  const result = await collection.deleteOne({ _id: id });
  return result.deletedCount === 1;
}

/**
 * Exécute un service en appelant son endpoint avec les données du formulaire
 * @param serviceId ID du service à exécuter
 * @param formData Données saisies dans le formulaire par l'utilisateur
 * @returns Réponse de l'API appelée
 */
export async function executeService(
  serviceId: string,
  formData: Record<string, any>
): Promise<any> {
  const service = await findServiceById(serviceId);
  
  if (!service) {
    throw new Error("Service not found");
  }

  if (!service.endpointUrl) {
    throw new Error("Service endpoint URL is not configured");
  }

  // Construire le body en utilisant les liaisons configurées
  const requestBody = buildRequestBody(formData, service.fields || [], service.bodyStructure || []);

  // Préparer les headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Ajouter la clé API si configurée
  if (service.apiKey && service.apiKeyHeader) {
    headers[service.apiKeyHeader] = service.apiKey;
  }

  try {
    const response = await fetch(service.endpointUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error executing service:', error);
    throw error;
  }
}

/**
 * Construit le corps de la requête en mappant les données du formulaire
 * vers la structure du body en utilisant les liaisons configurées
 */
function buildRequestBody(
  formData: Record<string, any>,
  fields: ServiceDocument['fields'],
  bodyStructure: ServiceDocument['bodyStructure']
): Record<string, any> {
  if (!fields || !bodyStructure) {
    return formData; // Fallback: utiliser les données telles quelles
  }

  // Créer un mapping des IDs de body vers les chemins
  const bodyFieldsMap = createBodyFieldsMap(bodyStructure);
  
  // Construire l'objet final
  const result: Record<string, any> = {};

  // Pour chaque champ du formulaire avec une liaison
  fields.forEach(field => {
    if (field.linkedBodyField && formData[field.label]) {
      const bodyField = bodyFieldsMap.get(field.linkedBodyField);
      if (bodyField) {
        setNestedProperty(result, bodyField.path, formData[field.label]);
      }
    }
  });

  return result;
}

/**
 * Crée un mapping des IDs de champs body vers leurs chemins
 */
function createBodyFieldsMap(
  bodyStructure: ServiceDocument['bodyStructure'],
  prefix = ''
): Map<string, { path: string; field: any }> {
  const map = new Map();
  
  if (!bodyStructure) return map;

  bodyStructure.forEach(field => {
    const currentPath = prefix ? `${prefix}.${field.label}` : field.label;
    map.set(field.id.toString(), { path: currentPath, field });
    
    if (field.children && field.children.length > 0) {
      const childMap = createBodyFieldsMap(field.children, currentPath);
      childMap.forEach((value, key) => map.set(key, value));
    }
  });

  return map;
}

/**
 * Définit une propriété imbriquée dans un objet en utilisant un chemin
 * Ex: setNestedProperty(obj, 'user.profile.name', 'John') définit obj.user.profile.name = 'John'
 */
function setNestedProperty(obj: Record<string, any>, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}
