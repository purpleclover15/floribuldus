import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../services/artwork.service';
import { AudioService } from '../audio-service/audio-service.component';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-exhibition',
  imports: [CommonModule],
  templateUrl: './exhibition.component.html',
  styleUrl: './exhibition.component.css'
})
export class ExhibitionComponent {
  fullImageUrl : string = "assets/exhibition/Main_Timpul_Mitic.png"
  audioTrackName : string = 'Flori_Buldus_Timpul_Mitic[RO].mp3';

  constructor(
    private artworkService: ArtworkService,
    private cdr: ChangeDetectorRef,
    public audioService: AudioService
  ) {}

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

  playEnglish() {
    this.audioService.play('Flori_Buldus_Timpul_Mitic[EN].mp3');
  }

  playRomanian() {
    this.audioService.play('Flori_Buldus_Timpul_Mitic[RO].mp3');
  }
}
