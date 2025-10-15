import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResult } from '../../../models';

@Component({
  selector: 'app-default-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default-details.component.html',
  styleUrl: './default-details.component.scss'
})
export class DefaultDetailsComponent {
  @Input() result?: SearchResult;
}