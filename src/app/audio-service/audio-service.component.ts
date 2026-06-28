import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audio = new Audio();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private currentFileSubject = new BehaviorSubject<string | null>(null);
  currentFile$ = this.currentFileSubject.asObservable();

  private progressSubject = new BehaviorSubject<number>(0);
  progress$ = this.progressSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject<number>(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject<number>(0);
  duration$ = this.durationSubject.asObservable();

  constructor() {

    this.audio.addEventListener('timeupdate', () => {
      this.progressSubject.next(
        (this.audio.currentTime / this.audio.duration) * 100 || 0
      );

      this.currentTimeSubject.next(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.audio.duration);
    });

    this.audio.addEventListener('play', () => {
      this.isPlayingSubject.next(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);
    });
  }

  // ✅ SAFE getter (fixes NG issues + clean comparison)
  get currentFile(): string | null {
    return this.currentFileSubject.value;
  }

  // 🎧 PLAY
  play(file: string) {

    // toggle pause if same file
    if (this.currentFile === file && !this.audio.paused) {
      this.audio.pause();
      return;
    }

    this.audio.src = file;
    this.currentFileSubject.next(file);

    this.audio.load();

    const playPromise = this.audio.play();

    // ⚠️ browser autoplay safety
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Audio play blocked or failed:', err);
      });
    }
  }

  // ⏸ PAUSE
  pause() {
    this.audio.pause();
  }

  // 🎚 SEEK
  seek(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    this.audio.currentTime =
      (value / 100) * this.audio.duration;
  }

  // 🔄 RESET
  reset() {
    this.audio.pause();
    this.audio.currentTime = 0;

    this.isPlayingSubject.next(false);
    this.progressSubject.next(0);
    this.currentTimeSubject.next(0);
  }
}