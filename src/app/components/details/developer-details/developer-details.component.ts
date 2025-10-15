import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-developer-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="developer-details">
      <div class="detail-item">
        <!-- <span class="label">👤 Nombre:</span> -->
        <span class="label">Nombre:</span>
        <span class="value">{{ details?.fullName || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <!-- <span class="label">📧 Email:</span> -->
        <span class="label">Email:</span>
        <span class="value">{{ details?.email || 'N/A' }}</span>
      </div>
      <div class="detail-item apps-section">
        <!-- <span class="label">📱 Aplicaciones Asociadas ({{ details?.enrichedApps?.length || 0 }}):</span> -->
        <span class="label">Apps ({{ details?.enrichedApps?.length || 0 }}):</span>
        <div class="apps-container">
          <div *ngFor="let app of details?.enrichedApps" class="app-card">
            <div class="app-header">
              <span class="app-name">{{ app.name }}</span>
              <span class="app-status" [ngClass]="'status-' + app.status">{{ app.status }}</span>
            </div>
            <div class="app-details">
              <div class="app-detail">
                <!-- <span class="app-label">🆔 ID:</span> -->
                <span class="app-label">ID:</span>
                <span class="app-value">{{ app.appId }}</span>
              </div>
              <div class="app-detail">
                <!-- <span class="app-label">👤 Usuario:</span> -->
                <span class="app-label">Usuario:</span>
                <span class="app-value">{{ app.username }}</span>
              </div>
              <div class="app-detail products-detail" *ngIf="app.products && app.products.length > 0">
                <!-- <span class="app-label">📦 Productos:</span> -->
                <span class="app-label">Productos:</span>
                <div class="app-products">
                  <span *ngFor="let product of app.products" class="app-product-chip">
                    {{ product }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="!details?.enrichedApps || details?.enrichedApps?.length === 0" class="no-apps">
            Ninguna aplicación asociada
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './developer-details.component.scss'
})
export class DeveloperDetailsComponent {
  @Input() details?: SearchResultDetails;
}