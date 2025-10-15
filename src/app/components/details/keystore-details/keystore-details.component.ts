import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-keystore-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="keystore-details">
      <div class="detail-item">
        <!-- <span class="label">📅 Expiración:</span> -->
        <span class="label">Expiración:</span>
        <span class="value">{{ details?.expirationDate || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <!-- <span class="label">✅ Estado:</span> -->
        <span class="label">Estado:</span>
        <span class="value" [class.valid]="details?.isValid === 'true'" [class.invalid]="details?.isValid !== 'true'">
          {{ details?.isValid === 'true' ? 'Válido' : 'Inválido' }}
        </span>
      </div>
    </div>
  `,
  styleUrl: './keystore-details.component.scss'
})
export class KeystoreDetailsComponent {
  @Input() details?: SearchResultDetails;
}