import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-app-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-details">
      <div class="detail-item">
        <!-- <span class="label">👤 Developer:</span> -->
        <span class="label">Developer:</span>
        <span class="value">{{ details?.developerName || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <!-- <span class="label">🏷️ Username:</span> -->
        <span class="label">Username:</span>
        <span class="value">{{ details?.username || 'N/A' }}</span>
      </div>
      <div class="detail-item products-section">
        <!-- <span class="label">📦 Productos Asociados ({{ details?.appProducts?.length || 0 }}):</span> -->
        <span class="label">Productos ({{ details?.appProducts?.length || 0 }}):</span>
        <div class="products-container">
          <div *ngFor="let product of details?.appProducts" class="product-chip">
            {{ product }}
          </div>
          <div *ngIf="!details?.appProducts || details?.appProducts?.length === 0" class="no-products">
            Ningún producto asociado
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './app-details.component.scss'
})
export class AppDetailsComponent {
  @Input() details?: SearchResultDetails;
}