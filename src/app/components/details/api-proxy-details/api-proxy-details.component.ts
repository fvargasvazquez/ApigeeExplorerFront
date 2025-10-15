import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails, EnrichedEnvironment } from '../../../models';

@Component({
  selector: 'app-api-proxy-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-proxy-details.component.html',
  styleUrl: './api-proxy-details.component.scss'
})
export class ApiProxyDetailsComponent {
  @Input() details?: SearchResultDetails;

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
}