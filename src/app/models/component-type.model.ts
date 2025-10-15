export interface ComponentType {
  value: string;
  displayName: string;
  icon: string;
  description: string;
}

export const COMPONENT_TYPES: ComponentType[] = [
  {
    value: 'ApiProxy',
    //displayName: 'API Proxies',
    displayName: 'APIS',
    //icon: '🌐',
    icon: '',
    description: 'Proxies de API que actúan como intermediarios'
  },
  {
    value: 'App',
    // displayName: 'Applications',
    displayName: 'APPS',
    //icon: '📲',
    icon: '',
    description: 'Aplicaciones que consumen las APIs'
  },
  {
    value: 'Developer',
    // displayName: 'Developers',
    displayName:'DEVS',
    //icon: '👤',
    icon: '',
    description: 'Desarrolladores registrados en el sistema'
  },
  {
    value: 'Product',
    // displayName: 'Products',
    displayName: 'PRODUCTOS',
    //icon: '📦',
    icon: '',
    description: 'Productos que agrupan APIs'
  },
  {
    value: 'Keystore',
    // displayName: 'Keystores',
    displayName: 'KEYSTORES',
    //icon: '🔐',
    icon: '',
    description: 'Almacenes de certificados y claves'
  },
  {
    value: 'Reference',
    // displayName: 'References',
    displayName: 'REFERENCES',
    //icon: '🔗',
    icon: '',
    description: 'Referencias a recursos externos'
  },
  {
    value: 'TargetServer',
    // displayName: 'Target Servers',
    displayName: 'TARGET SERVER',
    //icon: '🎯',
    icon: '',
    description: 'Servidores de destino para las APIs'
  }
];

export function getComponentTypeInfo(value: string): ComponentType | undefined {
  return COMPONENT_TYPES.find(type => type.value === value);
}

export function getComponentIcon(componentType: string): string {
  const type = getComponentTypeInfo(componentType);
  return type?.icon || '📄';
  //return type?.icon || '';
}

export function getComponentDisplayName(componentType: string): string {
  const type = getComponentTypeInfo(componentType);
  return type?.displayName || componentType;
}