import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResult } from '../../../models';
import { CopyButtonComponent } from '../../copy-button/copy-button.component';

@Component({
  selector: 'app-default-details',
  standalone: true,
  imports: [CommonModule, CopyButtonComponent],
  templateUrl: './default-details.component.html',
  styleUrl: './default-details.component.scss'
})
export class DefaultDetailsComponent {
  @Input() result?: SearchResult;

  getAllDefaultInfo(): string {
    if (!this.result) return '';

    let info = `ELEMENTO: ${this.result.name || 'N/A'}\n`;
    info += `ID: ${this.result.id || 'N/A'}\n`;

    return info.trim();
  }
}