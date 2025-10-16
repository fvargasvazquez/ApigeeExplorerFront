import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ModalService, ApiModalData } from '../../services/modal.service';
import { ApiService } from '../../services/api.service';
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
    private apiService: ApiService
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
}