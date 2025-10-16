import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';
import { ModalService } from '../../../services';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  @Input() details?: SearchResultDetails;
  @Input() environment?: string;
  @Input() disableClicks?: boolean = false;

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
}