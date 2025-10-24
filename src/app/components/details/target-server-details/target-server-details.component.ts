import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';
import { ModalService } from '../../../services';
import { CopyButtonComponent } from '../../copy-button/copy-button.component';

@Component({
  selector: 'app-target-server-details',
  standalone: true,
  imports: [CommonModule, CopyButtonComponent],
  templateUrl: './target-server-details.component.html',
  styleUrl: './target-server-details.component.scss'
})
export class TargetServerDetailsComponent {
  @Input() details?: SearchResultDetails;
  @Input() environment?: string;
  @Input() disableClicks?: boolean = false;
  @Input() name?: string;

  constructor(private modalService: ModalService) {}

  onApiClick(apiName: string) {
    if (this.environment && !this.disableClicks) {
      this.modalService.openApiModal(apiName, this.environment);
    }
  }

  /**
   * Check if there are APIs in any environment
   */
  hasApisInEnvironments(): boolean {
    if (!this.details?.apisByEnvironment) {
      return false;
    }
    
    return Object.values(this.details.apisByEnvironment).some(apis => apis && apis.length > 0);
  }

  /**
   * Get APIs for a specific environment
   */
  getApisForEnvironment(environment: string): string[] | undefined {
    return this.details?.apisByEnvironment?.[environment];
  }

  /**
   * Get host with port information
   */
  getHostWithPort(): string {
    const host = this.details?.host || 'N/A';
    const port = this.details?.port;
    
    if (port && host !== 'N/A') {
      return `${host}:${port}`;
    }
    
    return host;
  }

  getAllTargetServerInfo(): string {
    if (!this.details) return '';

    let info = `TARGET SERVER: ${this.name || 'N/A'}\n`;
    info += `Host: ${this.getHostWithPort()}\n\n`;

    if (this.details.environments && this.details.environments.length > 0) {
      info += `AMBIENTES (${this.details.environments.length}):\n`;
      info += `${this.details.environments.join(', ')}\n\n`;
    }

    // Check if we have APIs grouped by environment
    if (this.details.apisByEnvironment && this.hasApisInEnvironments()) {
      info += `APIs POR AMBIENTE:\n`;
      
      this.details.environments?.forEach(env => {
        const apis = this.getApisForEnvironment(env);
        info += `\n• ${env} (${apis?.length || 0}):\n`;
        if (apis && apis.length > 0) {
          apis.forEach(api => {
            info += `  - ${api}\n`;
          });
        } else {
          info += `  - Ninguna API en este ambiente\n`;
        }
      });
    } else if (this.details.associatedApis && this.details.associatedApis.length > 0) {
      // Fallback to flat list
      info += `APIs ASOCIADAS (${this.details.associatedApis.length}):\n`;
      this.details.associatedApis.forEach(api => {
        info += `• ${api}\n`;
      });
    } else {
      info += `APIs: Ninguna API asociada\n`;
    }

    return info.trim();
  }
}