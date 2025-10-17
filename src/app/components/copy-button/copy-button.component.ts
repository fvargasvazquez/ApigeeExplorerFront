import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardService } from '../../services';

@Component({
  selector: 'app-copy-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.scss'
})
export class CopyButtonComponent {
  @Input() textToCopy: string = '';
  @Input() tooltip: string = 'Copiar al portapapeles';
  @Input() size: 'sm' | 'md' | 'lg' = 'sm';
  @Input() variant: 'default' | 'subtle' = 'subtle';

  constructor(private clipboardService: ClipboardService) {}

  async onCopy(event: Event): Promise<void> {
    event.stopPropagation(); // Prevent triggering parent click events
    
    if (!this.textToCopy) {
      return;
    }

    const success = await this.clipboardService.copyToClipboard(this.textToCopy);
    
    if (success) {
      this.clipboardService.showCopySuccess(`Copiado: ${this.textToCopy.length > 30 ? this.textToCopy.substring(0, 30) + '...' : this.textToCopy}`);
    } else {
      this.clipboardService.showCopySuccess('Error al copiar');
    }
  }
}