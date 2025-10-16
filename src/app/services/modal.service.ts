import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchResultDetails } from '../models';

export interface ModalData {
  isOpen: boolean;
  productName?: string;
  productDetails?: SearchResultDetails;
  environment?: string;
}

export interface AppModalData {
  isOpen: boolean;
  appName?: string;
  appDetails?: SearchResultDetails;
  environment?: string;
}

export interface ApiModalData {
  isOpen: boolean;
  apiName?: string;
  apiDetails?: SearchResultDetails;
  environment?: string;
}

export interface DeveloperModalData {
  isOpen: boolean;
  developerName?: string;
  developerDetails?: SearchResultDetails;
  environment?: string;
}

export interface TargetServerModalData {
  isOpen: boolean;
  targetServerName?: string;
  targetServerDetails?: SearchResultDetails;
  environment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Product Modal
  private modalSubject = new BehaviorSubject<ModalData>({ isOpen: false });
  public modal$ = this.modalSubject.asObservable();

  // App Modal
  private appModalSubject = new BehaviorSubject<AppModalData>({ isOpen: false });
  public appModal$ = this.appModalSubject.asObservable();

  // API Modal
  private apiModalSubject = new BehaviorSubject<ApiModalData>({ isOpen: false });
  public apiModal$ = this.apiModalSubject.asObservable();

  // Developer Modal
  private developerModalSubject = new BehaviorSubject<DeveloperModalData>({ isOpen: false });
  public developerModal$ = this.developerModalSubject.asObservable();

  // Target Server Modal
  private targetServerModalSubject = new BehaviorSubject<TargetServerModalData>({ isOpen: false });
  public targetServerModal$ = this.targetServerModalSubject.asObservable();

  // Product Modal Methods
  openProductModal(productName: string, environment: string, productDetails?: SearchResultDetails) {
    this.modalSubject.next({
      isOpen: true,
      productName,
      productDetails,
      environment
    });
  }

  closeModal() {
    this.modalSubject.next({ isOpen: false });
  }

  // App Modal Methods
  openAppModal(appName: string, environment: string, appDetails?: SearchResultDetails) {
    this.appModalSubject.next({
      isOpen: true,
      appName,
      appDetails,
      environment
    });
  }

  closeAppModal() {
    this.appModalSubject.next({ isOpen: false });
  }

  // API Modal Methods
  openApiModal(apiName: string, environment: string, apiDetails?: SearchResultDetails) {
    this.apiModalSubject.next({
      isOpen: true,
      apiName,
      apiDetails,
      environment
    });
  }

  closeApiModal() {
    this.apiModalSubject.next({ isOpen: false });
  }

  // Developer Modal Methods
  openDeveloperModal(developerName: string, environment: string, developerDetails?: SearchResultDetails) {
    this.developerModalSubject.next({
      isOpen: true,
      developerName,
      developerDetails,
      environment
    });
  }

  closeDeveloperModal() {
    this.developerModalSubject.next({ isOpen: false });
  }

  // Target Server Modal Methods
  openTargetServerModal(targetServerName: string, environment: string, targetServerDetails?: SearchResultDetails) {
    this.targetServerModalSubject.next({
      isOpen: true,
      targetServerName,
      targetServerDetails,
      environment
    });
  }

  closeTargetServerModal() {
    this.targetServerModalSubject.next({ isOpen: false });
  }
}