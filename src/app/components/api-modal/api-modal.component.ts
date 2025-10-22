import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ModalService, ApiModalData } from '../../services/modal.service';
import { ApiService } from '../../services/api.service';
import { ClipboardService } from '../../services/clipboard.service';
import { ApiProxyDetailsComponent } from '../details/api-proxy-details/api-proxy-details.component';
import { SearchResultDetails } from '../../models';

@Component({
  selector: 'app-api-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ApiProxyDetailsComponent
  ],
  templateUrl: './api-modal.component.html',
  styleUrl: './api-modal.component.scss'
})
export class ApiModalComponent implements OnInit, OnDestroy {
  modalData: ApiModalData = { isOpen: false };
  apiDetails?: SearchResultDetails;
  isLoading = false;
  errorMessage = '';
  
  private subscription?: Subscription;

  constructor(
    private modalService: ModalService,
    private apiService: ApiService,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit() {
    this.subscription = this.modalService.apiModal$.subscribe(data => {
      this.modalData = data;
      if (data.isOpen && data.apiName && data.environment) {
        this.loadApiDetails(data.apiName, data.environment);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadApiDetails(apiName: string, environment: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiDetails = undefined;

    this.apiService.search(environment, apiName).subscribe({
      next: (results) => {
        const apiResult = results.find(r => 
          r.componentType === 'ApiProxy' && 
          r.name.toLowerCase() === apiName.toLowerCase()
        );
        
        if (apiResult) {
          this.apiDetails = apiResult.details;
        } else {
          this.errorMessage = 'No se encontraron detalles para esta API';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading API details:', error);
        this.errorMessage = 'Error al cargar los detalles de la API';
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.modalService.closeApiModal();
  }

  async copyToClipboard() {
    if (!this.apiDetails || !this.modalData.apiName || !this.modalData.environment) {
      return;
    }

    const result = {
      componentType: 'ApiProxy' as const,
      name: this.modalData.apiName,
      details: this.apiDetails
    };

    const copyText = this.getResultCopyText(result, this.modalData.environment);
    const success = await this.clipboardService.copyToClipboard(copyText);
    
    if (success) {
      this.clipboardService.showCopySuccess('Información copiada al portapapeles');
    } else {
      this.clipboardService.showCopySuccess('Error al copiar');
    }
  }

  private getResultCopyText(result: any, environment: string): string {
    if (!result.details) return `${result.componentType}: ${result.name}`;

    let componentLabel = result.componentType === 'ApiProxy' ? 'API' : 
                        result.componentType === 'Product' ? 'PRODUCTO' : 
                        result.componentType === 'TargetServer' ? 'TARGET SERVER' :
                        result.componentType.toUpperCase();
    let info = `${componentLabel}: ${result.name}\n`;

    if (result.componentType === 'ApiProxy') {
      if (result.details.enrichedProxyEnvironments && result.details.enrichedProxyEnvironments.length > 0) {
        result.details.enrichedProxyEnvironments.forEach((env: any, index: number) => {
          info += `\n• Ambiente: ${env.ambiente}`;
          info += `\n  BasePath: ${env.basePath}`;
          if (env.revision) {
            info += `\n  Revisión: ${env.revision}`;
          }
          
          const productsToShow = this.getEnvironmentProducts(env, result.details);
          if (productsToShow.length > 0) {
            info += `\n  Productos:`;
            productsToShow.forEach((product: string) => {
              info += `\n    ${product}`;
            });
          }
          
          if (env.targetServers && env.targetServers.length > 0) {
            info += `\n  Target Servers: ${env.targetServers.join(', ')}`;
          }
          if (env.flows && env.flows.length > 0) {
            info += `\n  Recursos:`;
            env.flows.forEach((flow: any) => {
              info += `\n    ${flow.method} ${flow.path}`;
            });
          }

          // Agregar curls inmediatamente después de los recursos de cada ambiente
          const basePath = env.basePath || '';
          const baseUrl = this.getBaseUrlForEnvironment(env.ambiente, environment);
          
          info += `\n  Curls:`;
          info += `\n    curl --noproxy "*" -k -X GET "${baseUrl}${basePath}/ping" -H "Authorization: Bearer XXXXX"`;
          info += `\n    curl --noproxy "*" -k -X GET "${baseUrl}${basePath}/status" -H "Authorization: Bearer XXXXX"`;
          
          if (result.details?.enrichedProxyEnvironments && index < result.details.enrichedProxyEnvironments.length - 1) {
            info += `\n`;
          }
        });
      }
    }

    return info.trim();
  }

  private filterMonitoringProducts(products: string[]): string[] {
    return products.filter(product => {
      const productUpper = product.toUpperCase();
      return !productUpper.includes('BAZ MON MONITOREO');
    });
  }

  private getEnvironmentProducts(env: any, details: any): string[] {
    if (env.products && env.products.length > 0) {
      return this.filterMonitoringProducts(env.products);
    }

    if (details?.enrichedProducts && details.enrichedProducts.length > 0) {
      const filteredProducts = details.enrichedProducts
        .filter((product: any) => product.ambientes === env.ambiente)
        .map((product: any) => product.nombreDisplay || product.name);

      return this.filterMonitoringProducts(filteredProducts);
    }

    const allProducts = details?.products || [];
    const environmentFiltered = allProducts.filter((productName: string) => {
      const productUpper = productName.toUpperCase();
      const ambienteUpper = env.ambiente.toUpperCase();

      if (ambienteUpper.includes('EXT')) {
        return productUpper.endsWith(' EXT');
      }

      if (ambienteUpper.includes('INT')) {
        return productUpper.endsWith(' INT');
      }

      return true;
    });

    return this.filterMonitoringProducts(environmentFiltered);
  }

  /**
   * Obtiene la URL base según el ambiente
   */
  private getBaseUrlForEnvironment(ambiente: string, environment: string): string {
    const ambienteUpper = ambiente.toUpperCase();
    
    // Determinar si es AWS o ONPREMISE basándose en el environment seleccionado
    const isAWS = environment?.toUpperCase().includes('AWS') || false;
    
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