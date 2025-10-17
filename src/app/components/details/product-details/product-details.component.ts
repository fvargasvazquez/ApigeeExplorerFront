import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';
import { ModalService } from '../../../services';
import { CopyButtonComponent } from '../../copy-button/copy-button.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, CopyButtonComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  @Input() details?: SearchResultDetails;
  @Input() environment?: string;
  @Input() disableClicks?: boolean = false;
  @Input() name?: string;

  constructor(private modalService: ModalService) { }

  onApiClick(apiName: string) {
    if (this.environment && !this.disableClicks) {
      this.modalService.openApiModal(apiName, this.environment);
    }
  }

  onTargetServerClick(targetServerName: string) {
    if (this.environment && !this.disableClicks) {
      this.modalService.openTargetServerModal(targetServerName, this.environment);
    }
  }

  onAppClick(appName: string) {
    if (this.environment && !this.disableClicks) {
      this.modalService.openAppModal(appName, this.environment);
    }
  }

  getAllProductInfo(): string {
    if (!this.details) return '';

    let info = `PRODUCTO: ${this.name || 'N/A'}\n`;
    info += `Recursos: ${this.details.apiResources || 'N/A'}\n\n`;

    if (this.details.enrichedProxies && this.details.enrichedProxies.length > 0) {
      info += `API PROXIES (${this.details.enrichedProxies.length}):\n`;
      
      this.details.enrichedProxies.forEach(proxy => {
        info += `\n• ${proxy.name}\n`;
        
        if (proxy.environments && proxy.environments.length > 0) {
          info += `  Ambientes: ${proxy.environments.join(', ')}\n`;
        }
        
        if (proxy.basePaths && proxy.basePaths.length > 0) {
          info += `  BasePath: ${proxy.basePaths.join(', ')}\n`;
        }
        
        if (proxy.targetServers && proxy.targetServers.length > 0) {
          info += `  Target Servers: ${proxy.targetServers.join(', ')}\n`;
        }
      });
    } else {
      info += `API PROXIES: Ningún API Proxy asociado\n`;
    }

    info += `\n`;

    if (this.details.enrichedProductApps && this.details.enrichedProductApps.length > 0) {
      info += `APLICACIONES (${this.details.enrichedProductApps.length}):\n`;
      this.details.enrichedProductApps.forEach(app => {
        info += `• ${app.name}\n`;
      });
    } else {
      info += `APLICACIONES: Ninguna App asociada\n`;
    }

    return info.trim();
  }
}