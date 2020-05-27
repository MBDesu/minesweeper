import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'minesweeper';
  selectedDifficulty: string;

  ngOnInit(): void {
    this.selectedDifficulty = 'hard';
  }

}
