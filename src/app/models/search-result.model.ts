export interface SearchResult {
  componentType: string;
  id: string;
  name: string;
  environment: string;
  component: any;
  details?: SearchResultDetails;
}

export interface SearchResultDetails {
  // Para API Proxies
  environments?: string[];
  basePaths?: string[];
  targetServers?: string[];
  products?: string[];
  enrichedProducts?: EnrichedProduct[];
  enrichedProxyEnvironments?: EnrichedEnvironment[];
  
  // Para Apps
  developerName?: string;
  username?: string;
  appProducts?: string[];
  status?: string;
  
  // Para Developers
  fullName?: string;
  email?: string;
  apps?: string[];
  enrichedApps?: EnrichedApp[];
  
  // Para Products
  apiResources?: string;
  associatedApps?: string[];
  enrichedProductApps?: EnrichedProductApp[];
  proxies?: string[];
  enrichedProxies?: EnrichedProxy[];
  
  // Para Keystores
  expirationDate?: string;
  validationDate?: string;
  isValid?: string;
  
  // Para References
  keystoreReference?: string;
  aliasName?: string;
  
  // Para Target Servers
  host?: string;
  associatedApis?: string[];
  apisByEnvironment?: { [environment: string]: string[] };
}

export interface EnrichedApp {
  name: string;
  appId: string;
  username: string;
  products: string[];
  status: string;
}

export interface EnrichedProductApp {
  name: string;
  appId: string;
  username: string;
  status: string;
  developerName: string;
  developerEmail: string;
}

export interface EnrichedFlow {
  name: string;
  method: string;
  path: string;
  productos?: string[];
}

export interface EnrichedEnvironment {
  ambiente: string;
  basePath: string;
  flows: EnrichedFlow[];
  targetServers: string[];
  products?: string[];
  revision?: string;
}

export interface EnrichedProduct {
  name: string;
  ambientes: string;
  apiResources?: string;
  apps?: string;
  nombreDisplay?: string;
  description?: string;
  proxies?: string[];
}

export interface EnrichedProxy {
  name: string;
  environments: string[];
  basePaths: string[];
  targetServers: string[];
}