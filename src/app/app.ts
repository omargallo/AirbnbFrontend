import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import { MainLayout } from "./layout/main-layout/main-layout";
import { HostProperties } from "./components/host-properties/host-properties";
import { Footer } from "./components/footer/footer";
import { Confirm } from "./shared/components/confirm/confirm";
import { ConfirmOtp } from "./pages/confirm-otp/confirm-otp";
import { SignalrTestComponent } from "./signal-rtest/signal-rtest";
import { ResetPassword } from "./pages/reset-password/reset-password";
import { AdminDashboard } from "./pages/admin/Dashboard/AdminDashboard";
import { UsersComponent } from "./pages/admin/pages/users/users";
import { BlockingOverlay } from './shared/components/blocking-overlay/blocking-overlay';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Confirm, Login, Register, ResetPassword,BlockingOverlay, CommonModule],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Airbnb';

    showOverlay = false;

  ngOnInit() {
    this.checkWidth();
    window.addEventListener('resize', () => this.checkWidth());

    // 👁️ MutationObserver to detect if overlay is removed manually
    const observer = new MutationObserver(() => {
      if (this.showOverlay && !document.querySelector('app-blocking-overlay')) {
        this.showOverlay = true; // Triggers Angular to re-add it
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  checkWidth() {
    this.showOverlay = window.innerWidth < 1200;
  }

}
