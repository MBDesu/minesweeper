import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'minesweeper';
  selectedDifficulty: string;
  difficultyChanged = new EventEmitter<string>();
  restartClicked = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.selectedDifficulty = 'easy';
    this.difficultyChanged.emit(this.selectedDifficulty);
  }

  selectedNewDifficulty(): void {
    this.difficultyChanged.emit(this.selectedDifficulty);
  }

  restart(): void {
    this.restartClicked.emit(true);
  }

}
