export class Cell {

  adjacentMines: string | number;
  isMine: boolean;
  status: string;
  row: number;
  col: number;

  constructor(isMine: boolean) {
    this.isMine = isMine;
    this.adjacentMines = isMine ? '*' : '0';
    this.status = 'open';
  }

}
