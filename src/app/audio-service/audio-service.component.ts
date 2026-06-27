import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audio = new Audio();

  progress = 0;
  currentTime = 0;
  duration = 0;

  isPlaying = false;
  currentFile = '';

  constructor() {

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.progress = 0;
      this.currentTime = 0;
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.duration = this.audio.duration || 0;

      if (this.duration > 0) {
        this.progress = (this.currentTime / this.duration) * 100;
      }
    });
  }

  play(file: string) {

    // Clicking the currently playing file stops it.
    if (this.isPlaying && this.currentFile === file) {
      this.stop();
      return;
    }

    this.currentFile = file;

    this.audio.pause();
    this.audio.src = `assets/audio/${file}`;
    this.audio.load();

    console.log(this.audio.src );

    this.audio.play();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;

    this.isPlaying = false;
    this.progress = 0;
    this.currentTime = 0;
  }

  formatTime(seconds: number): string {

    if (!seconds || isNaN(seconds))
      return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  seek(event: Event) {
    const target = event.target as HTMLInputElement;

    const value = Number(target.value);

    if (this.duration > 0) {
      this.audio.currentTime = (value / 100) * this.duration;
      this.progress = value;
    }
  }
}