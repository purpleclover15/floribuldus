import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FloriBuldusArt';

  lastScrollTop = 0;
  navbarVisible = true;

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const delta = st - this.lastScrollTop;

    const downThreshold = 10;
    const upThreshold = 10;

    if (delta > downThreshold) {
      // Scrolling down fast enough
      this.navbarVisible = false;
    } else if (delta < -upThreshold) {
      // Scrolling up fast enough
      this.navbarVisible = true;
    }

    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  forceScroll(section: string) {
  const currentUrl = this.router.url;
  if (currentUrl.includes('/home')) {
    // Still on home, manually dispatch a scroll event
    const event = new CustomEvent('scrollToSection', { detail: section });
    window.dispatchEvent(event);
  }
}
}
