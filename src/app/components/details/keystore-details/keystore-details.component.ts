import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-keystore-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keystore-details.component.html',
  styleUrl: './keystore-details.component.scss'
})
export class KeystoreDetailsComponent {
  @Input() details?: SearchResultDetails;
}