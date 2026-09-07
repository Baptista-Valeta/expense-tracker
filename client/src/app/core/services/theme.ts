import { DOCUMENT, Inject, inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export type theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public renderer: Renderer2; // permite modificar elementos do DOM de maneira apropriada no angular
  public readonly STORAGE_KEY = 'theme';

  constructor(public rendererFactory: RendererFactory2,  @Inject(DOCUMENT) private document: Document) {
    this.renderer = this.rendererFactory.createRenderer(null, null); // criar renderer com RendererFactory2 para manipular o DOM
  };
  
  currentTheme (theme: theme) {
    const html = this.document.documentElement;
    if(theme === 'dark') {
      this.renderer.addClass(html, 'dark-theme');
    }else {
      this.renderer.removeClass(html, 'dark-theme');
    };

    localStorage.setItem(this.STORAGE_KEY, theme);
  };
  
  loadTheme() {
    const savedTheme = this.getTheme();

    if(savedTheme) {
      this.currentTheme(savedTheme as theme);
      return;
    };

    this.currentTheme('light');
  };

  getTheme () {
    return localStorage.getItem(this.STORAGE_KEY) || 'light';
  };
};
