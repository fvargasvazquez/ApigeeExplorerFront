import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-reference-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reference-details.component.html',
  styleUrl: './reference-details.component.scss'
})
export class ReferenceDetailsComponent {
  @Input() details?: SearchResultDetails;
}