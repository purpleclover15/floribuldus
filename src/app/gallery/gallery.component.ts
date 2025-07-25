import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { ArtworkService } from '../services/artwork.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgForOf, NgIf, CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements AfterViewInit {
  artworks = [
    { folder: 'art1', images: ['1.jpg'], title: 'Art 1' },
    { folder: 'art2', images: ['2.jpg'], title: 'Art 2' },
    { folder: 'art3', images: ['3.jpg'], title: 'Art 3' }
  ];
  activeIndex = 0;
  isHoveringMainImage = false;
  showTitle = false;

  loadedImages = 0;
  totalImages = 0;

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('artImage') artImages!: QueryList<ElementRef<HTMLImageElement>>;

  constructor(
    private artworkService: ArtworkService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.artworkService.getArtworks().subscribe((data) => {
      this.artworks = this.shuffleArray(data);
      this.activeIndex = 1;
      this.loadedImages = 0;
      this.totalImages = this.artworks.length + 2; // Main + prepend + append
      this.cdr.detectChanges();
    });
  }

  onImageLoad() {
    this.loadedImages++;
    if (this.loadedImages === this.totalImages) {
      // All images loaded
      setTimeout(() => {
        this.centerActiveImage();
        setTimeout(() => {
          this.showTitle = true;
          this.centerActiveImage();
        }, 350); // Match scroll animation
      }, 100);
    }
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  scrollGallery(direction: 'left' | 'right') {
    this.showTitle = false;
    if (direction === 'left') {
      this.activeIndex--;
    } else if (direction === 'right') {
      this.activeIndex++;
    }
    this.centerActiveImage();

    setTimeout(() => {
      if (this.activeIndex < 0) {
        this.activeIndex = this.artworks.length - 1;
        this.centerActiveImage(false);
      } else if (this.activeIndex >= this.artworks.length) {
        this.activeIndex = 0;
        this.centerActiveImage(false);
      }
      this.showTitle = true;
    }, 350);
  }

  centerActiveImage(smooth = true) {
    const images = this.artImages.toArray();
    if (!images[this.activeIndex + 1]) return; // +1 for prepended image
    const container = this.scrollContainer.nativeElement;
    const img = images[this.activeIndex + 1].nativeElement;
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const scrollLeft =
      img.offsetLeft - containerRect.width / 2 + imgRect.width / 2;
    container.scrollTo({ left: scrollLeft, behavior: smooth ? 'smooth' : 'auto' });
  }

  onHoverMainImage(index: number) {
    this.isHoveringMainImage = index === this.activeIndex;
  }

  onLeaveMainImage() {
    this.isHoveringMainImage = false;
  }

  goToArtworkDetail(folder: string) {
    this.router.navigate(['/artwork', folder]);
  }
}
