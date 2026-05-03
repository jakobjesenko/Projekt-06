import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public pages that are safe to prerender
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'register', renderMode: RenderMode.Prerender },
  { path: 'forgot-password', renderMode: RenderMode.Prerender },
  { path: 'reset-password', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'how-it-works', renderMode: RenderMode.Prerender },
  { path: 'faq', renderMode: RenderMode.Prerender },
  { path: 'gdpr', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },

  // Auth/user-specific pages: do NOT prerender
  { path: 'dashboard', renderMode: RenderMode.Client },
  { path: 'profile/edit', renderMode: RenderMode.Client },
  { path: 'admin', renderMode: RenderMode.Client },

  // These look dynamic too, so keep them client-rendered for now
  { path: 'chat', renderMode: RenderMode.Client },
  { path: 'rating', renderMode: RenderMode.Client },

  // Redirect/fallback routes
  { path: 'location', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];