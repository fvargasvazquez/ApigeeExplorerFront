import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService, ClipboardService } from '../../services';
import { SearchResult, COMPONENT_TYPES, getComponentIcon, getComponentDisplayName } from '../../models';
import {
  TargetServerDetailsComponent,
  ApiProxyDetailsComponent,
  AppDetailsComponent,
  DeveloperDetailsComponent,
  ProductDetailsComponent,
  KeystoreDetailsComponent,
  ReferenceDetailsComponent,
  DefaultDetailsComponent
} from '../details';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { AppModalComponent } from '../app-modal/app-modal.component';
import { ApiModalComponent } from '../api-modal/api-modal.component';
import { DeveloperModalComponent } from '../developer-modal/developer-modal.component';
import { TargetServerModalComponent } from '../target-server-modal/target-server-modal.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    TargetServerDetailsComponent,
    ApiProxyDetailsComponent,
    AppDetailsComponent,
    DeveloperDetailsComponent,
    ProductDetailsComponent,
    KeystoreDetailsComponent,
    ReferenceDetailsComponent,
    DefaultDetailsComponent,
    ProductModalComponent,
    AppModalComponent,
    ApiModalComponent,
    DeveloperModalComponent,
    TargetServerModalComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  environment: string = '';
  searchResults: SearchResult[] = [];
  isLoading = false;
  errorMessage = '';

  componentTypeControl = new FormControl('');
  searchControl = new FormControl('');

  componentTypes = COMPONENT_TYPES;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private clipboardService: ClipboardService
  ) { }

  ngOnInit() {
    this.environment = this.route.snapshot.params['environment'];

    // Setup search functionality
    this.componentTypeControl.valueChanges.subscribe(() => {
      this.performSearch();
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performSearch();
    });
  }

  performSearch() {
    const componentType = this.componentTypeControl.value;
    const searchTerm = this.searchControl.value;

    if (!componentType || !searchTerm || searchTerm.length < 2) {
      this.searchResults = [];
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.search(this.environment, searchTerm).subscribe({
      next: (results) => {
        this.searchResults = results.filter(r => r.componentType === componentType);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.errorMessage = 'Error al realizar la búsqueda. Por favor, intenta de nuevo.';
        this.isLoading = false;
        this.searchResults = [];
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getComponentIcon(componentType: string): string {
    return getComponentIcon(componentType);
  }

  getComponentDisplayName(componentType: string): string {
    return getComponentDisplayName(componentType);
  }

  /**
   * Filtra productos de monitoreo para mostrar solo los productos relevantes en la UI
   * @param products Lista de productos
   * @returns Lista filtrada sin productos de monitoreo
   */
  private filterMonitoringProducts(products: string[]): string[] {
    // Excluir productos de monitoreo (BAZ MON)
    return products.filter(product => {
      const productUpper = product.toUpperCase();
      return !productUpper.includes('BAZ MON MONITOREO');
    });
  }

  /**
   * Reutiliza la lógica del ApiProxyDetailsComponent para obtener productos por ambiente
   * @param env Ambiente enriquecido
   * @param details Detalles del resultado de búsqueda
   * @returns Lista de productos filtrados para el ambiente
   */
  private getEnvironmentProducts(env: any, details: any): string[] {
    // Si el ambiente tiene productos específicos, los devuelve (con filtro de exclusión)
    if (env.products && env.products.length > 0) {
      return this.filterMonitoringProducts(env.products);
    }

    // Si hay productos enriquecidos con información de ambientes, filtrar por ambiente
    if (details?.enrichedProducts && details.enrichedProducts.length > 0) {
      const filteredProducts = details.enrichedProducts
        .filter((product: any) => product.ambientes === env.ambiente)
        .map((product: any) => product.nombreDisplay || product.name);

      return this.filterMonitoringProducts(filteredProducts);
    }

    // Filtrar productos generales basándose en el nombre del ambiente
    // Esto es un fallback cuando no hay productos enriquecidos
    const allProducts = details?.products || [];

    const environmentFiltered = allProducts.filter((productName: string) => {
      const productUpper = productName.toUpperCase();
      const ambienteUpper = env.ambiente.toUpperCase();

      // Si el ambiente contiene 'EXT', mostrar productos que terminen en 'EXT'
      if (ambienteUpper.includes('EXT')) {
        return productUpper.endsWith(' EXT');
      }

      // Si el ambiente contiene 'INT', mostrar productos que terminen en 'INT'  
      if (ambienteUpper.includes('INT')) {
        return productUpper.endsWith(' INT');
      }

      // Si no se puede determinar, mostrar todos
      return true;
    });

    return this.filterMonitoringProducts(environmentFiltered);
  }

  async copyToClipboard(result: SearchResult) {
    const copyText = this.getResultCopyText(result);
    const success = await this.clipboardService.copyToClipboard(copyText);

    if (success) {
      this.clipboardService.showCopySuccess('Información copiada al portapapeles');
    } else {
      this.clipboardService.showCopySuccess('Error al copiar');
    }
  }

  getResultCopyText(result: SearchResult): string {
    if (!result.details) return `${result.componentType}: ${result.name}`;

    let componentLabel = result.componentType === 'ApiProxy' ? 'API' :
      result.componentType === 'Product' ? 'PRODUCTO' :
        result.componentType === 'TargetServer' ? 'TARGET SERVER' :
          result.componentType.toUpperCase();
    let info = `${componentLabel}: ${result.name}\n`;

    switch (result.componentType) {
      case 'ApiProxy':
        if (result.details.enrichedProxyEnvironments && result.details.enrichedProxyEnvironments.length > 0) {
          result.details.enrichedProxyEnvironments.forEach((env, index) => {
            info += `\n• Ambiente: ${env.ambiente}`;
            info += `\n  BasePath: ${env.basePath}`;
            if (env.revision) {
              info += `\n  Revisión: ${env.revision}`;
            }
            // Usar la misma lógica que el componente ApiProxyDetailsComponent
            const productsToShow = this.getEnvironmentProducts(env, result.details);
            if (productsToShow.length > 0) {
              info += `\n  Productos:`;
              productsToShow.forEach(product => {
                info += `\n    ${product}`;
              });
            }
            if (env.targetServers && env.targetServers.length > 0) {
              info += `\n  Target Servers: ${env.targetServers.join(', ')}`;
            }
            if (env.flows && env.flows.length > 0) {
              // Separar recursos normales de healthcheck
              const normalFlows = env.flows.filter((flow: any) =>
                flow.path?.toLowerCase() !== '/ping' && flow.path?.toLowerCase() !== '/status'
              );
              const healthcheckFlows = env.flows.filter((flow: any) =>
                flow.path?.toLowerCase() === '/ping' || flow.path?.toLowerCase() === '/status'
              );

              // Mostrar recursos normales primero
              if (normalFlows.length > 0) {
                info += `\n  Recursos:`;
                normalFlows.forEach((flow: any) => {
                  info += `\n    ${flow.method} ${flow.path}`;
                });
              }

              // Mostrar recursos de healthcheck al final
              if (healthcheckFlows.length > 0) {
                info += `\n  Recursos healthcheck:`;
                healthcheckFlows.forEach((flow: any) => {
                  info += `\n    ${flow.method} ${flow.path}`;
                });
              }
            }

            // Validación correcta: verificar si existen flows de ping y status en los datos originales
            const basePath = env.basePath || '';
            const baseUrl = this.getBaseUrlForEnvironment(env.ambiente);

            const hasPing = env.flows && env.flows.some((flow: any) => flow.path?.toLowerCase() === '/ping');
            const hasStatus = env.flows && env.flows.some((flow: any) => flow.path?.toLowerCase() === '/status');

            if (hasPing || hasStatus) {
              info += `\n  Curls:`;

              if (hasPing) {
                info += `\n    curl --noproxy "*" -k -X GET "${baseUrl}${basePath}/ping" -H "Authorization: Bearer XXXXX"`;
              }

              if (hasStatus) {
                info += `\n    curl --noproxy "*" -k -X GET "${baseUrl}${basePath}/status" -H "Authorization: Bearer XXXXX"`;
              }
            }

            // Agregar salto de línea entre ambientes (excepto el último)
            if (result.details?.enrichedProxyEnvironments && index < result.details.enrichedProxyEnvironments.length - 1) {
              info += `\n`;
            }
          });
        }
        break;

      case 'Product':
        if (result.details.apiResources && result.details.apiResources !== 'N/A') {
          const recursos = result.details.apiResources.split(',').map((r: string) => r.trim());
          info += `\n• Recursos:\n`;
          recursos.forEach((recurso: string) => {
            info += `    ${recurso}\n`;
          });
        } else {
          info += `\n• Recursos: N/A\n`;
        }

        if (result.details.enrichedProxies && result.details.enrichedProxies.length > 0) {
          info += `\n`;
          result.details.enrichedProxies.forEach(proxy => {
            info += `API: ${proxy.name}\n`;
            if (proxy.environments && proxy.environments.length > 0) {
              info += `  Ambientes: ${proxy.environments.join(', ')}\n`;
            }
            if (proxy.basePaths && proxy.basePaths.length > 0) {
              info += `  BasePath: ${proxy.basePaths.join(', ')}\n`;
            }
            if (proxy.targetServers && proxy.targetServers.length > 0) {
              info += `  Target Servers: ${proxy.targetServers.join(', ')}\n`;
            }
            info += `\n`; // Salto de línea entre APIs
          });
        }

        if (result.details.enrichedProductApps && result.details.enrichedProductApps.length > 0) {
          info += `APPS:\n`;
          result.details.enrichedProductApps.forEach(app => {
            info += `• ${app.name}\n`;
          });
        }
        break;

      case 'App':
        info += `\n• Developer: ${result.details.developerName || 'N/A'}\n`;
        info += `Username: ${result.details.username || 'N/A'}\n`;
        info += `Status: ${result.details.status || 'N/A'}\n`;

        if (result.details.appProducts && result.details.appProducts.length > 0) {
          // Filtrar productos de monitoreo para las apps también
          const filteredProducts = this.filterMonitoringProducts(result.details.appProducts);
          if (filteredProducts.length > 0) {
            info += `\nPRODUCTOS:\n`;
            filteredProducts.forEach(product => {
              info += `    ${product}\n`;
            });
          }
        }
        break;

      case 'Developer':
        info += `\n• Nombre: ${result.details.fullName || 'N/A'}\n`;
        info += `Email: ${result.details.email || 'N/A'}\n`;

        if (result.details.enrichedApps && result.details.enrichedApps.length > 0) {
          info += `\nAPPS:\n`;
          result.details.enrichedApps.forEach(app => {
            info += `• ${app.name} (${app.status})\n`;

            // Mostrar productos de cada app si están disponibles
            if (app.products && app.products.length > 0) {
              const filteredProducts = this.filterMonitoringProducts(app.products);
              if (filteredProducts.length > 0) {
                info += `Productos:\n`;
                filteredProducts.forEach(product => {
                  info += `  ${product}\n`;
                });
              }
            }
            info += `\n`; // Salto de línea entre apps
          });
        }
        break;

      case 'TargetServer':
        const host = result.details.host || 'N/A';
        const port = result.details.port;
        const hostWithPort = (port && host !== 'N/A') ? `${host}:${port}` : host;
        info += `\nHost: ${hostWithPort}\n`;

        // Mostrar ambientes si están disponibles
        if (result.details.environments && result.details.environments.length > 0) {
          info += `Ambientes: ${result.details.environments.join(', ')}\n`;
        }

        // Mostrar APIs por ambiente
        if (result.details.apisByEnvironment) {
          Object.entries(result.details.apisByEnvironment).forEach(([env, apis]) => {
            if (apis && (apis as string[]).length > 0) {
              info += `\n• APIS ${env.toUpperCase()}:\n`;
              (apis as string[]).forEach(api => {
                info += `    ${api}\n`;
              });
            }
          });
        }
        break;

      case 'Keystore':
        info += `Expiración: ${result.details.expirationDate || 'N/A'}\n`;
        info += `Estado: ${result.details.isValid === 'true' ? 'Válido' : 'Inválido'}\n`;
        break;

      case 'Reference':
        info += `Keystore: ${result.details.keystoreReference || 'N/A'}\n`;
        info += `Alias: ${result.details.aliasName || 'N/A'}\n`;
        break;

      default:
        info += `ID: ${result.id || 'N/A'}\n`;
        break;
    }

    return info.trim();
  }

  /**
   * Obtiene la URL base según el ambiente
   */
  private getBaseUrlForEnvironment(ambiente: string): string {
    const ambienteUpper = ambiente.toUpperCase();

    // Determinar si es AWS o ONPREMISE basándose en el environment seleccionado
    const isAWS = this.environment?.toUpperCase().includes('AWS') || false;

    if (isAWS) {
      // AWS INT
      if (ambienteUpper.includes('INT')) {
        return 'https://internal-APIGEE-PROD-ALB01-1366664713.us-east-1.elb.amazonaws.com:8081';
      }
      // AWS EXT
      if (ambienteUpper.includes('EXT')) {
        return 'https://apis.apigeebaz.com:8080';
      }
    } else {
      // ONPREMISE INT
      if (ambienteUpper.includes('INT')) {
        return 'https://prod-api.bancoazteca.com:8080';
      }
      // ONPREMISE EXT
      if (ambienteUpper.includes('EXT')) {
        return 'https://api.bancoazteca.com';
      }
    }

    // Default fallback para ONPREMISE EXT
    return 'https://api.bancoazteca.com';
  }
}