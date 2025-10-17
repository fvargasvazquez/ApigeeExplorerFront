import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';
import { ModalService } from '../../../services';

@Component({
  selector: 'app-developer-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './developer-details.component.html',
  styleUrl: './developer-details.component.scss'
})
export class DeveloperDetailsComponent {
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

  getAllDeveloperInfo(): string {
    if (!this.details) return '';

    let info = `DESARROLLADOR: ${this.name || 'N/A'}\n`;
    info += `Nombre: ${this.details.fullName || 'N/A'}\n`;
    info += `Email: ${this.details.email || 'N/A'}\n\n`;

    if (this.details.enrichedApps && this.details.enrichedApps.length > 0) {
      info += `APLICACIONES (${this.details.enrichedApps.length}):\n`;

      this.details.enrichedApps.forEach(app => {
        info += `\n• ${app.name}\n`;
        info += `  ID: ${app.appId}\n`;
        info += `  Usuario: ${app.username}\n`;
        info += `  Estado: ${app.status}\n`;

        if (app.products && app.products.length > 0) {
          info += `  Productos: ${app.products.join(', ')}\n`;
        }
      });
    } else {
      info += `APLICACIONES: Ninguna aplicación asociada\n`;
    }

    return info.trim();
  }
}