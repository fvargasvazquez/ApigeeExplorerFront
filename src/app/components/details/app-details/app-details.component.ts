import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-details.component.html',
  styleUrl: './app-details.component.scss'
})
export class AppDetailsComponent {
  @Input() details?: SearchResultDetails;
}