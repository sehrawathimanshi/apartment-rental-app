import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /**
   * Set an item in localStorage.
   * @param key - The key for the localStorage item.
   * @param value - The value to be stored (automatically stringified if not a string).
   */
  setItem(key: string, value: any): void {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item in localStorage: ${error}`);
    }
  }

  /**
   * Get an item from localStorage.
   * @param key - The key for the localStorage item.
   * @returns The parsed value from localStorage (if JSON) or the string value.
   */
  getItem<T = any>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? (this.isJson(value) ? JSON.parse(value) : value) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${error}`);
      return null;
    }
  }

  /**
   * Remove an item from localStorage.
   * @param key - The key for the localStorage item to remove.
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${error}`);
    }
  }

  /**
   * Check if a value is valid JSON.
   * @param value - The value to check.
   * @returns True if the value is JSON, otherwise false.
   */
  private isJson(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }
}
