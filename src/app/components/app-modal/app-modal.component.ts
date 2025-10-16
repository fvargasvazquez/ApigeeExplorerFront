import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ModalService, AppModalData } from '../../services/modal.service';
import { ApiService } from '../../services/api.service';
import { AppDetailsComponent } from '../details/app-details/app-details.component';
import { SearchResultDetails } from '../../models';

@Component({
  selector: 'app-app-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AppDetailsComponent
  ],
  templateUrl: './app-modal.component.html',
  styleUrl: './app-modal.component.scss'
})
export class AppModalComponent implements OnInit, OnDestroy {
  modalData: AppModalData = { isOpen: false };
  appDetails?: SearchResultDetails;
  isLoading = false;
  errorMessage = '';
  
  private subscription?: Subscription;

  constructor(
    private modalService: ModalService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.subscription = this.modalService.appModal$.subscribe(data => {
      this.modalData = data;
      if (data.isOpen && data.appName && data.environment) {
        this.loadAppDetails(data.appName, data.environment);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadAppDetails(appName: string, environment: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.appDetails = undefined;

    this.apiService.search(environment, appName).subscribe({
      next: (results) => {
        const appResult = results.find(r => 
          r.componentType === 'App' && 
          r.name.toLowerCase() === appName.toLowerCase()
        );
        
        if (appResult) {
          this.appDetails = appResult.details;
        } else {
          this.errorMessage = 'No se encontraron detalles para esta aplicación';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading app details:', error);
        this.errorMessage = 'Error al cargar los detalles de la aplicación';
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.modalService.closeAppModal();
  }
}