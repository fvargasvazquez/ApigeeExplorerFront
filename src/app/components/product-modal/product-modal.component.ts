import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ModalService, ModalData } from '../../services/modal.service';
import { ApiService } from '../../services/api.service';
import { ClipboardService } from '../../services/clipboard.service';
import { ProductDetailsComponent } from '../details/product-details/product-details.component';
import { SearchResultDetails } from '../../models';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ProductDetailsComponent
  ],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent implements OnInit, OnDestroy {
  modalData: ModalData = { isOpen: false };
  productDetails?: SearchResultDetails;
  isLoading = false;
  errorMessage = '';
  
  private subscription?: Subscription;

  constructor(
    private modalService: ModalService,
    private apiService: ApiService,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit() {
    this.subscription = this.modalService.modal$.subscribe(data => {
      this.modalData = data;
      if (data.isOpen && data.productName && data.environment) {
        this.loadProductDetails(data.productName, data.environment);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadProductDetails(productName: string, environment: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.productDetails = undefined;

    this.apiService.search(environment, productName).subscribe({
      next: (results) => {
        const productResult = results.find(r => 
          r.componentType === 'Product' && 
          r.name.toLowerCase() === productName.toLowerCase()
        );
        
        if (productResult) {
          this.productDetails = productResult.details;
        } else {
          this.errorMessage = 'No se encontraron detalles para este producto';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product details:', error);
        this.errorMessage = 'Error al cargar los detalles del producto';
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }

  async copyToClipboard() {
    if (!this.productDetails || !this.modalData.productName || !this.modalData.environment) {
      return;
    }

    const result = {
      componentType: 'Product' as const,
      name: this.modalData.productName,
      details: this.productDetails
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

    if (result.componentType === 'Product') {
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
        result.details.enrichedProxies.forEach((proxy: any) => {
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
          info += `\n`;
        });
      }

      // Agregar las apps al texto copiado
      if (result.details.enrichedProductApps && result.details.enrichedProductApps.length > 0) {
        info += `APPS:\n`;
        result.details.enrichedProductApps.forEach((app: any) => {
          info += `• ${app.name}\n`;
        });
      }
    }

    return info.trim();
  }
}