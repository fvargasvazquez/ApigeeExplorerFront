import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ModalService, DeveloperModalData } from '../../services/modal.service';
import { ApiService } from '../../services/api.service';
import { ClipboardService } from '../../services/clipboard.service';
import { DeveloperDetailsComponent } from '../details/developer-details/developer-details.component';
import { SearchResultDetails } from '../../models';

@Component({
  selector: 'app-developer-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DeveloperDetailsComponent
  ],
  templateUrl: './developer-modal.component.html',
  styleUrl: './developer-modal.component.scss'
})
export class DeveloperModalComponent implements OnInit, OnDestroy {
  modalData: DeveloperModalData = { isOpen: false };
  developerDetails?: SearchResultDetails;
  isLoading = false;
  errorMessage = '';
  
  private subscription?: Subscription;

  constructor(
    private modalService: ModalService,
    private apiService: ApiService,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit() {
    this.subscription = this.modalService.developerModal$.subscribe(data => {
      this.modalData = data;
      if (data.isOpen && data.developerName && data.environment) {
        this.loadDeveloperDetails(data.developerName, data.environment);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadDeveloperDetails(developerName: string, environment: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.developerDetails = undefined;

    // First try searching for the developer
    this.apiService.search(environment, developerName).subscribe({
      next: (results) => {
        console.log('Search results for developer:', results);
        console.log('Looking for developer:', developerName);
        
        // Try different matching strategies
        let developerResult = results.find(r => 
          r.componentType === 'Developer' && 
          r.name.toLowerCase() === developerName.toLowerCase()
        );
        
        // If not found, try partial match with Developer type
        if (!developerResult) {
          developerResult = results.find(r => 
            r.componentType === 'Developer' && 
            r.name.toLowerCase().includes(developerName.toLowerCase())
          );
        }
        
        // If still not found, try case-insensitive exact match regardless of type
        if (!developerResult) {
          developerResult = results.find(r => 
            r.name.toLowerCase() === developerName.toLowerCase()
          );
        }
        
        // If still not found, try partial match regardless of type
        if (!developerResult) {
          developerResult = results.find(r => 
            r.name.toLowerCase().includes(developerName.toLowerCase())
          );
        }
        
        if (developerResult) {
          console.log('Found developer result:', developerResult);
          this.developerDetails = developerResult.details;
        } else {
          console.log('No developer found. Available results:');
          console.log('Component types:', [...new Set(results.map(r => r.componentType))]);
          console.log('Names:', results.map(r => r.name));
          
          // Create a mock developer details if we can't find the actual developer
          this.developerDetails = {
            fullName: developerName,
            email: 'No disponible',
            enrichedApps: []
          } as SearchResultDetails;
          console.log('Created mock developer details');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading developer details:', error);
        
        // Create a mock developer details as fallback
        this.developerDetails = {
          fullName: developerName,
          email: 'Error al cargar información',
          enrichedApps: []
        } as SearchResultDetails;
        
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.modalService.closeDeveloperModal();
  }

  async copyToClipboard() {
    if (!this.developerDetails || !this.modalData.developerName || !this.modalData.environment) {
      return;
    }

    const result = {
      componentType: 'Developer' as const,
      name: this.modalData.developerName,
      details: this.developerDetails
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

    if (result.componentType === 'Developer') {
      info += `\n• Nombre: ${result.details.fullName || 'N/A'}\n`;
      info += `Email: ${result.details.email || 'N/A'}\n`;
      
      if (result.details.enrichedApps && result.details.enrichedApps.length > 0) {
        info += `\nAPPS:\n`;
        result.details.enrichedApps.forEach((app: any) => {
          info += `• ${app.name} (${app.status})\n`;
          
          if (app.products && app.products.length > 0) {
            const filteredProducts = this.filterMonitoringProducts(app.products);
            if (filteredProducts.length > 0) {
              info += `Productos:\n`;
              filteredProducts.forEach((product: string) => {
                info += `  ${product}\n`;
              });
            }
          }
          info += `\n`;
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
}