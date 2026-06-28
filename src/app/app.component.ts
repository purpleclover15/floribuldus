import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export interface ExhibitionItem {
  id: string;
  title: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  exhibitions: ExhibitionItem[] = [];

  lastScrollTop = 0;
  navbarVisible = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<ExhibitionItem[]>(
      'assets/exhibitions/index.json'
    ).subscribe(data => {
      this.exhibitions = data;
    });
  }

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