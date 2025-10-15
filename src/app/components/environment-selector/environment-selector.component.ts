import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services';
import { getEnvironmentIcon, getEnvironmentDescription } from '../../models';

@Component({
  selector: 'app-environment-selector',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './environment-selector.component.html',
  styleUrl: './environment-selector.component.scss'
})
export class EnvironmentSelectorComponent implements OnInit {
  environments: string[] = ['AWS', 'ONP']; // Mostrar inmediatamente los ambientes por defecto
  isLoading = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // Cargar ambientes en segundo plano para actualizar si hay cambios
    this.isLoading = true;
    this.apiService.getEnvironments().subscribe({
      next: (envs) => {
        if (envs && envs.length > 0) {
          this.environments = envs;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading environments:', err);
        // Mantener los ambientes por defecto
        this.isLoading = false;
      }
    });
  }

  selectEnvironment(environment: string) {
    this.router.navigate([environment.toLowerCase(), 'search']);
  }

  getEnvironmentIcon(env: string): string {
    return getEnvironmentIcon(env);
  }

  getEnvironmentDescription(env: string): string {
    return getEnvironmentDescription(env);
  }
}