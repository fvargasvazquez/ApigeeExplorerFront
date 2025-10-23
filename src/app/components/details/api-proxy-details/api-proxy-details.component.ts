import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails, EnrichedEnvironment } from '../../../models';
import { ModalService } from '../../../services';

@Component({
  selector: 'app-api-proxy-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-proxy-details.component.html',
  styleUrl: './api-proxy-details.component.scss'
})
export class ApiProxyDetailsComponent {
  @Input() details?: SearchResultDetails;
  @Input() environment?: string;
  @Input() disableClicks?: boolean = false;
  @Input() name?: string;

  constructor(private modalService: ModalService) { }

  onProductClick(productName: string) {
    if (this.environment && !this.disableClicks) {
      this.modalService.openProductModal(productName, this.environment);
    }
  }

  onTargetServerClick(targetServerName: string) {
    if (this.environment && !this.disableClicks) {
      this.modalService.openTargetServerModal(targetServerName, this.environment);
    }
  }

  getEnvironmentProducts(env: EnrichedEnvironment): string[] {
    // Si el ambiente tiene productos específicos, los devuelve (con filtro de exclusión)
    if (env.products && env.products.length > 0) {
      return this.filterMonitoringProducts(env.products);
    }

    // Si hay productos enriquecidos con información de ambientes, filtrar por ambiente
    if (this.details?.enrichedProducts && this.details.enrichedProducts.length > 0) {
      const filteredProducts = this.details.enrichedProducts
        .filter(product => product.ambientes === env.ambiente)
        .map(product => product.nombreDisplay || product.name);

      return this.filterMonitoringProducts(filteredProducts);
    }

    // Filtrar productos generales basándose en el nombre del ambiente
    // Esto es un fallback cuando no hay productos enriquecidos
    const allProducts = this.details?.products || [];

    const environmentFiltered = allProducts.filter(productName => {
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

  private filterMonitoringProducts(products: string[]): string[] {
    // Excluir productos de monitoreo (BAZ MON)
    return products.filter(product => {
      const productUpper = product.toUpperCase();
      return !productUpper.includes('BAZ MON MONITOREO');
    });
  }

  getNormalFlows(env: EnrichedEnvironment): any[] {
    if (!env.flows) return [];
    return env.flows.filter(flow => 
      flow.path?.toLowerCase() !== '/ping' && flow.path?.toLowerCase() !== '/status'
    );
  }

  getHealthcheckFlows(env: EnrichedEnvironment): any[] {
    if (!env.flows) return [];
    return env.flows.filter(flow => 
      flow.path?.toLowerCase() === '/ping' || flow.path?.toLowerCase() === '/status'
    );
  }



  getAllApiProxyInfo(): string {
    if (!this.details) return '';

    let info = `API: ${this.name || 'N/A'}\n`;
    info += `Tipo: API Proxy\n\n`;

    if (this.details.enrichedProxyEnvironments && this.details.enrichedProxyEnvironments.length > 0) {
      info += `AMBIENTES Y ENDPOINTS:\n`;

      this.details.enrichedProxyEnvironments.forEach(env => {
        info += `\n• Ambiente: ${env.ambiente}\n`;
        info += `  BasePath: ${env.basePath}\n`;
        if (env.revision) {
          info += `  Revisión: ${env.revision}\n`;
        }

        const products = this.getEnvironmentProducts(env);
        if (products.length > 0) {
          info += `  Productos: ${products.join(', ')}\n`;
        }

        if (env.targetServers && env.targetServers.length > 0) {
          info += `  Target Servers: ${env.targetServers.join(', ')}\n`;
        }

        if (env.flows && env.flows.length > 0) {
          info += `  Endpoints (${env.flows.length}):\n`;
          env.flows.forEach(flow => {
            info += `    ${flow.method} ${flow.path}\n`;
          });
        }
      });
    }

    return info.trim();
  }
}