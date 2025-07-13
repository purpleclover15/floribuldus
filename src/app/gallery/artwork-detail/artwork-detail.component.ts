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
    const modalImage = document.getElementById('fullImageModalImg') as HTMLImageElement;
    modalImage.src = imageUrl;
    const modal = new bootstrap.Modal(document.getElementById('fullImageModal')!);
    modal.show();
  }
}