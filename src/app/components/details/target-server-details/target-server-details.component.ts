import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-target-server-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './target-server-details.component.html',
  styleUrl: './target-server-details.component.scss'
})
export class TargetServerDetailsComponent {
  @Input() details?: SearchResultDetails;
}