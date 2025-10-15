import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-details">
      <div class="detail-item">
        <!-- <span class="label">🔧 API Resources:</span> -->
        <span class="label">Recursos:</span>
        <span class="value">{{ details?.apiResources || 'N/A' }}</span>
      </div>
      
      <div class="detail-item product-proxies-section">
        <!-- <span class="label">🌐 API Proxies Asociados ({{ details?.enrichedProxies?.length || 0 }}):</span> -->
         <span class="label">API ({{ details?.enrichedProxies?.length || 0 }}):</span>
        <div class="product-proxies-container">
          <div *ngFor="let proxy of details?.enrichedProxies" class="product-proxy-card">
            <div class="product-proxy-header">
              <span class="product-proxy-name">{{ proxy.name }}</span>
            </div>
            <div class="product-proxy-details">
              <div class="product-proxy-detail">
                <!-- <span class="product-proxy-label">☁️ Ambientes:</span> -->
                <span class="product-proxy-label">Ambientes:</span>
                <div class="proxy-environments">
                  <span *ngFor="let env of proxy.environments" class="proxy-env-chip">
                    {{ env }}
                  </span>
                </div>
              </div>
              <div class="product-proxy-detail">
                <!-- <span class="product-proxy-label">🛣️ Base Paths:</span> -->
                <span class="product-proxy-label">BasePath:</span>
                <div class="proxy-basepaths">
                  <span *ngFor="let basePath of proxy.basePaths" class="proxy-basepath-chip">
                    {{ basePath }}
                  </span>
                </div>
              </div>
              <div class="product-proxy-detail" *ngIf="proxy.targetServers && proxy.targetServers.length > 0">
                <!-- <span class="product-proxy-label">🎯 Target Servers:</span> -->
                <span class="product-proxy-label">Target Servers:</span>
                <div class="proxy-targets">
                  <span *ngFor="let target of proxy.targetServers" class="proxy-target-chip">
                    {{ target }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="!details?.enrichedProxies || details?.enrichedProxies?.length === 0" class="no-product-proxies">
            Ningún API Proxy asociado
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  @Input() details?: SearchResultDetails;
}