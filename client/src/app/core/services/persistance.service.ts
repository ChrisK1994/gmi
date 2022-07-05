import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class PersistanceService {
  constructor(private helperService: HelperService) {
    const deletePassword = 'deletePassword';
    if (!localStorage[deletePassword] || !localStorage[deletePassword].length) {
      const newPassword = this.helperService.randomString();
      localStorage.setItem(deletePassword, JSON.stringify(newPassword));
    }
  }

  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get(key: string): any {
    try {
      if (localStorage[key]) {
        return JSON.parse(localStorage.getItem(key) || '');
      } else {
        return '';
      }
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return '';
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error Removing to localStorage', e);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error Clear all from localStorage', e);
    }
  }
}
