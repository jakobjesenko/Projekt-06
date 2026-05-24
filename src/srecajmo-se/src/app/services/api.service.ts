import { Injectable } from '@angular/core';
<<<<<<< HEAD
=======
import { environment } from '../../environments/environment';
>>>>>>> development

@Injectable({
  providedIn: 'root'
})
export class ApiService {

<<<<<<< HEAD
  constructor() { }
=======
  readonly baseUrl = environment.apiBaseUrl;

  url(path: string): string {
    const normalizedBase = this.baseUrl.replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');

    return `${normalizedBase}/${normalizedPath}`;
  }
>>>>>>> development
}
