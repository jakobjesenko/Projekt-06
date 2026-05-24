import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { FaqComponent } from './pages/faq/faq.component';
import { GdprComponent } from './pages/gdpr/gdpr.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ChatComponent } from './pages/chat/chat.component';
import { RatingComponent } from './pages/rating/rating.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AuthGuard } from './services/auth.guard';
import { GuestGuard } from './services/guest.guard';

export const routes: Routes = [
  { path: '',           component: HomeComponent },
  { path: 'login',      component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register',   component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'dashboard',  component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile/edit', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin',      component: AdminComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'about',      component: AboutComponent },
  { path: 'contact',    component: ContactComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'faq',        component: FaqComponent },
  { path: 'gdpr',       component: GdprComponent },
  { path: 'terms',      component: TermsComponent },
  { path: 'chat/:meetingId', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'chat', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'rating/:meetingId', component: RatingComponent, canActivate: [AuthGuard] },
  { path: 'rating', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'reset-password', component: ResetPasswordComponent },

  { path: 'location',   redirectTo: 'dashboard' },
  { path: '**',         redirectTo: '' }
];