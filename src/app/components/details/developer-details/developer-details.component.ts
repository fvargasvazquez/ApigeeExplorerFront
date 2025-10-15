import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-developer-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './developer-details.component.html',
  styleUrl: './developer-details.component.scss'
})
export class DeveloperDetailsComponent {
  @Input() details?: SearchResultDetails;
}