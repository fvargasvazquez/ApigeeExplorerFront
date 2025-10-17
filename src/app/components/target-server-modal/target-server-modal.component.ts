import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ModalService, TargetServerModalData } from '../../services/modal.service';
import { ApiService } from '../../services/api.service';
import { ClipboardService } from '../../services/clipboard.service';
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
    private apiService: ApiService,
    private clipboardService: ClipboardService
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

  async copyToClipboard() {
    if (!this.targetServerDetails || !this.modalData.targetServerName || !this.modalData.environment) {
      return;
    }

    const result = {
      componentType: 'TargetServer' as const,
      name: this.modalData.targetServerName,
      details: this.targetServerDetails
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

    if (result.componentType === 'TargetServer') {
      info += `\nHost: ${result.details.host || 'N/A'}\n`;
      
      if (result.details.environments && result.details.environments.length > 0) {
        info += `Ambientes: ${result.details.environments.join(', ')}\n`;
      }
      
      if (result.details.apisByEnvironment) {
        Object.entries(result.details.apisByEnvironment).forEach(([env, apis]) => {
          if (apis && (apis as string[]).length > 0) {
            info += `\n• APIS ${env.toUpperCase()}:\n`;
            (apis as string[]).forEach(api => {
              info += `    ${api}\n`;
            });
          }
        });
      }
    }

    return info.trim();
  }
}