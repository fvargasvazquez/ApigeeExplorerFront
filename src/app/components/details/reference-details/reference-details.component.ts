import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-reference-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reference-details">
      <div class="detail-item">
        <!-- <span class="label">🔐 Keystore:</span> -->
        <span class="label">Keystore:</span>
        <span class="value">{{ details?.keystoreReference || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <!-- <span class="label">🏷️ Alias:</span> -->
        <span class="label">Alias:</span>
        <span class="value">{{ details?.aliasName || 'N/A' }}</span>
      </div>
    </div>
  `,
  styleUrl: './reference-details.component.scss'
})
export class ReferenceDetailsComponent {
  @Input() details?: SearchResultDetails;
}