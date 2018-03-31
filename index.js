import "./src/const"
import Worker from './src/Chess.worker.js'

//引入jquery
import $ from "./src/jquery"
import "./css/master.css"

const ROW = 15;

class BoardGame
{
  constructor(container)
  {
    this.container = container;
    this.chess = [];
    this.available = false;
    this.offset = container.width() * 0.043;
    this.gap = container.width() * 0.0646;

    this.worker = new Worker();

    var self = this;

    this.worker.onmessage = function(e) {
      if(e.data.type === 'GO') {
        console.log(e.data.type, e.data.x, e.data.y);
        self.chess[e.data.x][e.data.y] = 2;
        self.print_board();
        self.Draw();
        if(self.is_win(e.data.x, e.data.y, 2))
          alert("AI WIN");
      }
      //console.log(e.data.type);

    }
  }

  InitGame()
  {
    $('.piece').remove();
    $('.blackpiece').remove();
    this.chess = [];
    for(let i = 0; i < ROW; i++) {
      let row = [];
      for(let j = 0;j < ROW; j++) {
        row.push(0);
      }
      this.chess.push(row);
    }
  }

  Draw()
  {
    $('.piece').remove();
    $('.blackpiece').remove();
    for(let i = 0; i < ROW; i++) {
      for(let j  =0; j < ROW; j++) {
        if(this.chess[i][j] === 1) {
          this.DrawPiece(i, j, 1);

        }else if(this.chess[i][j] === 2) {
          this.DrawPiece(i, j, 2);
        }
      }
    }
  }

  is_win(x, y, side) {
      let i = 0, j = 0;
      while(x+i < ROW && this.chess[x+i][y] === side) i++;
      while(x-j >= 0 && this.chess[x-j][y] === side) j++;
      if(i + j - 1 >= 5) return true;

      i = 0; j = 0;
      while(y+i < ROW && this.chess[x][y+i] === side) i++;
      while(y-j >= 0 && this.chess[x][y-j] === side) j++;
      if(i + j - 1 >= 5) return true;

      i = 0; j = 0;
      while(x-i >= 0 && y-i >=0 && this.chess[x-i][y-i] === side) i++;
      while(x+j < ROW && y+j < ROW && this.chess[x+j][y+j] === side) j++;
      if(i + j - 1 >= 5) return true;

      i = 0; j = 0;
      while(x-i >= 0 && y+i < ROW && this.chess[x-i][y+i] === side) i++;
      while(x+j < ROW && y-j >= 0 && this.chess[x+j][y-j] === side) j++;
      if(i + j - 1 >= 5) return true;

      return false;
  }

  //检查[row,col]位置是否合法
  check_valid(row, col) {
      return !(row < 0 || row >= ROW || col < 0 || col >= ROW || this.chess[row][col] !== 0);
  }

  DrawPiece(x, y, side)
  {
    let piece = $(document.createElement("div"));
    if(side === 1) {
      piece.addClass("piece");
    }
    else {
      piece.addClass("blackpiece")
    }
    piece.css("top", (x*this.gap+this.offset/2)+"px");
    piece.css("left", (y*this.gap+this.offset/2)+"px");
    piece.appendTo(this.container);
  }

  print_board() {
      let boardstr = '';
      for(let i = 0; i < ROW; i++) {
          for(let j = 0; j < ROW; j++) {
              boardstr = boardstr + this.chess[i][j] + ' ';
          }
          boardstr += '\n';
      }
      console.log(boardstr);
  }

  StartGame()
  {
    this.available = true;
  }

  go_a_step(row, col)
  {
    if(this.check_valid(row, col)) {
      this.chess[row][col] = 1;
      this.print_board();
      this.Draw();
    }
  }

  main()
  {
    let self = this;

    $("#prestart").click(function(){
      self.InitGame();
      self.StartGame();
      self.worker.postMessage({type:"START"});
    });

    $("#poststart").click(function(){
      self.InitGame();
      self.StartGame();
      self.worker.postMessage({type:"AISTART"});
    })


    $("#board").click(function(e){
      if(self.available){

        let col = Math.floor((e.offsetX-self.offset)/self.gap+0.5);
        let row = Math.floor((e.offsetY-self.offset)/self.gap+0.5);

        self.go_a_step(row, col);
        if(self.is_win(row, col, 1))
          alert("you win");
        else{
          self.worker.postMessage({type:"GO", x:row, y:col});
        }

        console.log(row, col);
        //self.DrawPiece(row, col);
        //alert("click");
      }
    })
  }
}


var game = new BoardGame($("#board"));
game.main();


//require(./css/master.css);
// test()
