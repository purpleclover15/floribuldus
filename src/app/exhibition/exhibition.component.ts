import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../audio-service/audio-service.component';

declare var bootstrap: any;

export interface Exhibition {
  title: string;
  exhibitionCover: string;

  audio: {
    en?: string;
    ro?: string;
  };

  artist: string;
}

@Component({
  selector: 'app-exhibition',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exhibition.component.html',
  styleUrl: './exhibition.component.css'
})
export class ExhibitionComponent implements OnInit {

  selectedLang: 'en' | 'ro' = 'en';

  exhibition?: Exhibition;

  fullImageUrl = '';
  exhibitionPath = '';

  audioText = {
    en: {
      title: '🎧 Listen to the artist',
      description:
        'Listen to the artist talk about the inspiration and story behind this exhibition.'
    },
    ro: {
      title: '🎧 Ascultă povestea expoziției',
      description:
        'Ascultă artistul povestind despre inspirația și povestea din spatele acestei expoziții.'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public audioService: AudioService
  ) {}

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id')!;
    this.exhibitionPath = `assets/exhibitions/${id}`;

    const lang = this.route.snapshot.queryParamMap.get('lang');
    if (lang === 'en' || lang === 'ro') {
      this.selectedLang = lang;
    }

    this.http.get<Exhibition>(`${this.exhibitionPath}/exhibition.json`)
      .subscribe(data => {

        this.exhibition = data;

        const file = this.exhibition.audio?.[this.selectedLang];

        if (file) {
          const fullPath = `${this.exhibitionPath}/${file}`;

          setTimeout(() => {
            this.audioService.play(fullPath);
          }, 300);
        }
      });
  }

  image(path: string) {
    return `${this.exhibitionPath}/${path}`;
  }

  // 🎧 play audio
  play() {
    const file = this.exhibition?.audio?.[this.selectedLang];

    if (!file) return;

    this.audioService.play(
      `${this.exhibitionPath}/${file}`
    );
  }

  // 🌍 language switch (URL synced)
  onLangChange(lang: 'en' | 'ro') {

    this.selectedLang = lang;

    // stop + reset audio
    this.audioService.reset();

    // update URL without reload
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { lang },
      queryParamsHandling: 'merge'
    });
  }

  showFullImage(path: string) {
    this.fullImageUrl = this.image(path);

    const modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('fullImageModal')
    );

    modal.show();
  }

  closeFullImage() {
    bootstrap.Modal
      .getInstance(document.getElementById('fullImageModal'))
      ?.hide();
  }
}