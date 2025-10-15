import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDetails } from '../../../models';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  @Input() details?: SearchResultDetails;
}