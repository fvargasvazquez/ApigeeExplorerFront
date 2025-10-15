import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResult } from '../../../models';

@Component({
  selector: 'app-default-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="default-details">
      <div class="detail-item">
        <!-- <span class="label">🆔 ID:</span> -->
        <span class="label">ID:</span>
        <span class="value">{{ result?.id }}</span>
      </div>
    </div>
  `,
  styleUrl: './default-details.component.scss'
})
export class DefaultDetailsComponent {
  @Input() result?: SearchResult;
}