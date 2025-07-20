import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-artwork-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artwork-detail.component.html',
  styleUrl: './artwork-detail.component.css'
})
export class ArtworkDetailComponent {
  folder: string | null = null;
  artworks: any[] = [];
  fullImageUrl: string | null = null; // <-- add this for modal image

  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private cdr: ChangeDetectorRef
  ) {
    this.folder = this.route.snapshot.paramMap.get('folder');
  }

  ngAfterViewInit(): void {
    this.artworkService.getArtworks().subscribe((data) => {
      const allArtworks = data;
      if (this.folder) {
        const filtered = allArtworks.filter(art => art.title === this.folder);
        this.artworks = filtered.length > 0 ? filtered : [];
      } else {
        this.artworks = allArtworks;
      }
      this.cdr.detectChanges();
    });
  }

  showFullImage(imageUrl: string) {
    this.fullImageUrl = imageUrl;
    this.cdr.detectChanges(); // ensure Angular updates modal
    const modalElement = document.getElementById('fullImageModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  }

  closeFullImage() {
    const modalElement = document.getElementById('fullImageModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}
