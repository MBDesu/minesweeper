import { Component, OnInit, Input } from '@angular/core';
import { GridSettings } from 'src/app/models/grid-settings';
import { Cell } from '../models/cell';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  settings: GridSettings;
  cells: Array<Cell> = [];
  rows: Array<Array<Cell>>;
  gameLost = false;
  gameWon = false;
  freeCells: number;
  mines: number;

  @Input()
  difficulty: string;

  constructor() {}

  ngOnInit() {
    this.initializeGrid();
  }

  initializeGrid(): void {
    switch (this.difficulty) {
      case 'easy':
        this.settings = new GridSettings(8, 8, 10);
        break;
      case 'medium':
        this.settings = new GridSettings(16, 16, 40);
        break;
      case 'hard':
        this.settings = new GridSettings(16, 30, 99);
        break;
      default:
        this.settings = new GridSettings(16, 30, 99);
        break;
    }
    const totalCells = this.settings.height * this.settings.width;
    this.freeCells = totalCells - this.settings.numMines;
    this.mines = this.settings.numMines;
    this.populateMines();
    this.constructRows();
    this.calculateNumTouching();
  }

  populateMines(): void {
    const totalCells = this.settings.height * this.settings.width;
    const minePositions = new Set<number>();
    let minesRemaining = this.settings.numMines;
    while (minesRemaining > 0) {
      const pos = Math.floor(Math.random() * totalCells);
      if (minePositions.has(pos)) {
        continue;
      } else {
        minePositions.add(pos);
        minesRemaining -= 1;
      }
    }
    for (let i = 0; i < totalCells; i++) {
      this.cells[i] = new Cell(minePositions.has(i));
    }
  }

  constructRows(): void {
    this.rows = new Array<Array<Cell>>();
    for (let i = 0; i < this.settings.height; i++) {
      const firstRowElement = i * this.settings.width;
      this.rows.push(this.cells.slice(firstRowElement, firstRowElement + this.settings.width));
    }
  }

  calculateNumTouching(): void {
    for (let i = 0; i < this.settings.height; i++) {
      for (let j = 0; j < this.settings.width; j++) {
        this.rows[i][j].row = i;
        this.rows[i][j].col = j;
        if (this.rows[i][j].isMine) {
          continue;
        }
        this.rows[i][j].adjacentMines = this.countAdjacentMines(this.rows[i][j]);
      }
    }
  }

  /**
   * could really refactor this to be done when mines are being placed;
   * simply increment each square adjacent to the mine each time one is placed
   * TODO, I suppose
   */
  countAdjacentMines(cell: Cell): number {
    let adjacentMines = 0;
    const row = cell.row;
    const col = cell.col;
    for (let i = Math.max(row - 1, 0); i <= Math.min(this.settings.height - 1, row + 1); i++) {
      for (let j = Math.max(col - 1, 0); j <= Math.min(this.settings.width - 1, col + 1); j++) {
        if (this.rows[i][j].isMine) {
          adjacentMines++;
        }
      }
    }
    return adjacentMines;
  }

  checkCell(cell: Cell): void {
    if (cell.status !== 'open') {
      return;
    } else if (cell.isMine) {
      this.revealBoard();
      this.gameLost = true;
    } else {
      cell.status = 'clear';
      if (cell.adjacentMines === 0) {
        // has to be a better way of doing this
        const adjacentCells = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (const adjacentCell of adjacentCells) {
          if (this.rows[cell.row + adjacentCell[0]] && this.rows[cell.row + adjacentCell[0]][cell.col + adjacentCell[1]]) {
            this.checkCell(this.rows[cell.row + adjacentCell[0]][cell.col + adjacentCell[1]]);
          }
        }
      }
      if (this.freeCells-- <= 1) { // there are no more free cells and the user hasn't clicked a mine; they must have won
        this.gameWon = true;
        this.mines = 0;
        this.revealBoard();
      }
      return;
    }
  }

  revealBoard(): void {
    for (const row of this.rows) {
      for (const cell of row) {
        cell.status = 'clear';
      }
    }
  }

  flagCell(cell: Cell): boolean {
    if (cell.status === 'clear') {
      return false;
    }
    const isFlagged = cell.status === 'flagged';
    if (isFlagged) {
      this.mines++;
      cell.status = 'open';
    } else {
      this.mines--;
      cell.status = 'flagged';
    }
    return !isFlagged;
  }

  restart(): void {
    this.gameLost = false;
    this.gameWon = false;
    this.initializeGrid();
  }

}
