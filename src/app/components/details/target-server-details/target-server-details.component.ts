import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-target-server-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './target-server-details.component.html',
  styleUrl: './target-server-details.component.scss'
})
export class TargetServerDetailsComponent {
  @Input() details?: SearchResultDetails;

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
}