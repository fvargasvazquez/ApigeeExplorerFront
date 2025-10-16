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

  constructor(private modalService: ModalService) {}

  onProductClick(productName: string) {
    if (this.environment && !this.disableClicks) {
      this.modalService.openProductModal(productName, this.environment);
    }
  }
}