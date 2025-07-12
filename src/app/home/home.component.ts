import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryComponent } from "../gallery/gallery.component";
import { AboutComponent } from "../about/about.component";
import { ContactComponent } from "../contact/contact.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [GalleryComponent, AboutComponent, ContactComponent]
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('gallerySection') gallerySection!: ElementRef;
  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('contactSection') contactSection!: ElementRef;

  private eventListener!: (event: any) => void;

  ngOnInit(): void {
    // Scroll on initial route load
    this.route.queryParams.subscribe(params => {
      const section = params['scrollTo'];
      if (section) {
        setTimeout(() => this.scrollToSection(section), 100);
      }
    });

    // Listen for custom scroll events
    this.eventListener = (event: any) => this.scrollToSection(event.detail);
    window.addEventListener('scrollToSection', this.eventListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scrollToSection', this.eventListener);
  }

  scrollToSection(section: string) {
    let target: HTMLElement | null = null;

    if (section === 'gallery') {
      target = this.gallerySection?.nativeElement;
    } else if (section === 'about') {
      target = this.aboutSection?.nativeElement;
    }
    else if (section === 'contact') {
      target = this.contactSection?.nativeElement;
    }

    if (target) {
      const yOffset = -80; // Adjust if you have a fixed navbar
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  constructor(private route: ActivatedRoute) {}
}