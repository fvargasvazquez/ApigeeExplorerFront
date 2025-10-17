import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';
import { ModalService } from '../../../services';

@Component({
  selector: 'app-app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-details.component.html',
  styleUrl: './app-details.component.scss'
})
export class AppDetailsComponent {
  @Input() details?: SearchResultDetails;
  @Input() environment?: string;
  @Input() disableClicks?: boolean = false;
  @Input() name?: string;

  constructor(private modalService: ModalService) {}

  onProductClick(productName: string) {
    if (this.environment && !this.disableClicks) {
      this.modalService.openProductModal(productName, this.environment);
    }
  }

  getAllAppInfo(): string {
    if (!this.details) return '';

    let info = `APLICACIÓN: ${this.name || 'N/A'}\n`;
    info += `Developer: ${this.details.developerName || 'N/A'}\n`;
    info += `Username: ${this.details.username || 'N/A'}\n`;
    info += `Status: ${this.details.status || 'N/A'}\n\n`;

    if (this.details.appProducts && this.details.appProducts.length > 0) {
      info += `PRODUCTOS (${this.details.appProducts.length}):\n`;
      this.details.appProducts.forEach(product => {
        info += `• ${product}\n`;
      });
    } else {
      info += `PRODUCTOS: Ningún producto asociado\n`;
    }

    return info.trim();
  }
}