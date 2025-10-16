import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../../services';
import { SearchResult, COMPONENT_TYPES, getComponentIcon, getComponentDisplayName } from '../../models';
import { 
  TargetServerDetailsComponent,
  ApiProxyDetailsComponent,
  AppDetailsComponent,
  DeveloperDetailsComponent,
  ProductDetailsComponent,
  KeystoreDetailsComponent,
  ReferenceDetailsComponent,
  DefaultDetailsComponent
} from '../details';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { AppModalComponent } from '../app-modal/app-modal.component';
import { ApiModalComponent } from '../api-modal/api-modal.component';
import { DeveloperModalComponent } from '../developer-modal/developer-modal.component';
import { TargetServerModalComponent } from '../target-server-modal/target-server-modal.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSelectModule,
    TargetServerDetailsComponent,
    ApiProxyDetailsComponent,
    AppDetailsComponent,
    DeveloperDetailsComponent,
    ProductDetailsComponent,
    KeystoreDetailsComponent,
    ReferenceDetailsComponent,
    DefaultDetailsComponent,
    ProductModalComponent,
    AppModalComponent,
    ApiModalComponent,
    DeveloperModalComponent,
    TargetServerModalComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  environment: string = '';
  searchResults: SearchResult[] = [];
  isLoading = false;
  errorMessage = '';
  
  componentTypeControl = new FormControl('');
  searchControl = new FormControl('');
  
  componentTypes = COMPONENT_TYPES;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.environment = this.route.snapshot.params['environment'];
    
    // Setup search functionality
    this.componentTypeControl.valueChanges.subscribe(() => {
      this.performSearch();
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performSearch();
    });
  }

  performSearch() {
    const componentType = this.componentTypeControl.value;
    const searchTerm = this.searchControl.value;

    if (!componentType || !searchTerm || searchTerm.length < 2) {
      this.searchResults = [];
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.search(this.environment, searchTerm).subscribe({
      next: (results) => {
        this.searchResults = results.filter(r => r.componentType === componentType);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.errorMessage = 'Error al realizar la búsqueda. Por favor, intenta de nuevo.';
        this.isLoading = false;
        this.searchResults = [];
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getComponentIcon(componentType: string): string {
    return getComponentIcon(componentType);
  }

  getComponentDisplayName(componentType: string): string {
    return getComponentDisplayName(componentType);
  }
}