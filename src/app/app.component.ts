import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  lastScrollTop = 0;
  navbarVisible = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const delta = st - this.lastScrollTop;

    const downThreshold = 10;
    const upThreshold = 10;

    if (delta > downThreshold) {
      this.navbarVisible = false;
    } else if (delta < -upThreshold) {
      this.navbarVisible = true;
    }

    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  forceScroll(target: string) {
    // Ensure mobile menu closes if open
    const navCollapse = document.getElementById('navbarNav');
    if (navCollapse && navCollapse.classList.contains('show')) {
      navCollapse.classList.remove('show');
    }
    setTimeout(() => {
      const el = document.getElementById(target + 'Section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}