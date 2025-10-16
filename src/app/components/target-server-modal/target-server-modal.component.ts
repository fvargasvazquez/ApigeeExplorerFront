import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ModalService, TargetServerModalData } from '../../services/modal.service';
import { ApiService } from '../../services/api.service';
import { TargetServerDetailsComponent } from '../details/target-server-details/target-server-details.component';
import { SearchResultDetails } from '../../models';

@Component({
  selector: 'app-target-server-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TargetServerDetailsComponent
  ],
  templateUrl: './target-server-modal.component.html',
  styleUrl: './target-server-modal.component.scss'
})
export class TargetServerModalComponent implements OnInit, OnDestroy {
  modalData: TargetServerModalData = { isOpen: false };
  targetServerDetails?: SearchResultDetails;
  isLoading = false;
  errorMessage = '';
  
  private subscription?: Subscription;

  constructor(
    private modalService: ModalService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.subscription = this.modalService.targetServerModal$.subscribe(data => {
      this.modalData = data;
      if (data.isOpen && data.targetServerName && data.environment) {
        this.loadTargetServerDetails(data.targetServerName, data.environment);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadTargetServerDetails(targetServerName: string, environment: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.targetServerDetails = undefined;

    this.apiService.search(environment, targetServerName).subscribe({
      next: (results) => {
        const targetServerResult = results.find(r => 
          r.componentType === 'TargetServer' && 
          r.name.toLowerCase() === targetServerName.toLowerCase()
        );
        
        if (targetServerResult) {
          this.targetServerDetails = targetServerResult.details;
        } else {
          this.errorMessage = 'No se encontraron detalles para este Target Server';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading target server details:', error);
        this.errorMessage = 'Error al cargar los detalles del Target Server';
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.modalService.closeTargetServerModal();
  }
}