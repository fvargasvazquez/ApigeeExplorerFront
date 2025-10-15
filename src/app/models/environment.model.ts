export interface Environment {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

export const ENVIRONMENTS: Environment[] = [
  {
    name: 'AWS',
    displayName: 'Amazon Web Services',
    description: 'Planeta AWS',
    icon: 'cloud',
    color: '#ff9a56',
    gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)'
  },
  {
    name: 'ONP',
    displayName: 'On Premise',
    description: 'Planeta Onpremise',
    icon: 'business',
    color: '#4ecdc4',
    gradient: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'
  }
];

export function getEnvironmentInfo(name: string): Environment | undefined {
  return ENVIRONMENTS.find(env => env.name.toLowerCase() === name.toLowerCase());
}

export function getEnvironmentIcon(name: string): string {
  const env = getEnvironmentInfo(name);
  return env?.icon || 'cloud';
}

export function getEnvironmentDescription(name: string): string {
  const env = getEnvironmentInfo(name);
  return env?.description || name;
}