import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ModalService, ModalData } from '../../services/modal.service';
import { ApiService } from '../../services/api.service';
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
    private apiService: ApiService
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
}