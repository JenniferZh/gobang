const AISIDE = 2;

class ChessBoard {
    constructor(row, col, board, next_block) {
        this.row = row;
        this.col = col;
        this.total_step = this.row * this.col;
        this.steps = 0;
        if(board === undefined) {
            let tboard = new Array();
            for(let i = 0; i < row; i++)
            {
                tboard[i] = new Array();
                for(let j = 0; j < col; j++)
                    tboard[i][j] = 0;
            }
            console.log("haha");
            this.board = tboard;
        } else {
            this.board = board;
        }

        if(next_block === undefined) {
          this.next_block = new Set();
        } else {
          this.next_block = next_block;
        }
    }

    //检查[row,col]位置是否合法
    check_valid(row, col) {
        //console.log(this.board[row][col]);
        return !(row < 0 || row >= this.row || col < 0 || col >= this.col || this.board[row][col] !== 0);
    }

    //打印棋盘
    print_board() {
        let boardstr = '';
        for(let i = 0; i < this.row; i++) {
            for(let j = 0; j < this.col; j++) {
                boardstr = boardstr + this.board[i][j] + ' ';
            }
            boardstr += '\n';
        }
        console.log(boardstr);
    }


    evaluate_help_horizontal(position, side)
    {
        let tables = [0, 35, 800, 15000, 800000];
        let antitables = [0, 15, 400, 1800, 100000];
        let result = 0;
        for(let i = 0; i < 5; i++)
        {
            //越界，返回0
            if(position[1]+i >= this.col || position[1]+i < 0)
                return 0;
            //十位保存己方棋子数字，各位保存对方棋子个数
            if(this.board[position[0]][position[1]+i] === side)
                result = result + 10;
            if(this.board[position[0]][position[1]+i] === (3-side))
                result = result + 1;
        }

        if(result === 0) return 7;

        if(result%10 === 0) return tables[result/10];
        if(result < 10) return antitables[result];

        return 0;
    }

    evaluate_help_vertical(position, side)
    {
        let tables = [0, 35, 800, 15000, 800000];
        let antitables = [0, 15, 400, 1800, 100000];
        let result = 0;
        for(let i = 0; i < 5; i++)
        {
            //越界，返回0
            if(position[0]+i >= this.row || position[0]+i < 0)
                return 0;
            //console.log('debug',position[0],i);
            //十位保存己方棋子数字，各位保存对方棋子个数
            if(this.board[position[0]+i][position[1]] === side)
                result = result + 10;
            if(this.board[position[0]+i][position[1]] === (3-side))
                result = result + 1;
        }

        if(result === 0) return 7;

        if(result%10 === 0) return tables[result/10];
        if(result < 10) return antitables[result];

        return 0;
    }

    evaluate_help_leap1(position, side)
    {
        let tables = [0, 35, 800, 15000, 800000];
        let antitables = [0, 15, 400, 1800, 100000];
        let result = 0;
        for(let i = 0; i < 5; i++)
        {
            //越界，返回0
            if(position[0]+i >= this.row || position[1]+i >= this.col || position[0]+i < 0 || position[1]+i  < 0)
                return 0;
            //十位保存己方棋子数字，各位保存对方棋子个数
            if(this.board[position[0]+i][position[1]+i] === side)
                result = result + 10;
            if(this.board[position[0]+i][position[1]+i] === (3-side))
                result = result + 1;
        }

        if(result === 0) return 7;

        if(result%10 === 0) return tables[result/10];
        if(result < 10) return antitables[result];

        return 0;
    }

    evaluate_help_leap2(position, side)
    {

        let tables = [0, 35, 800, 15000, 800000];
        let antitables = [0, 15, 400, 1800, 100000];
        let result = 0;
        for(let i = 0; i < 5; i++)
        {
            //越界，返回0
            if(position[0]-i < 0 || position[1]+i >= this.col || position[0]-i >= this.row || position[1]+i < 0)
                return 0;
            //十位保存己方棋子数字，各位保存对方棋子个数
            if(this.board[position[0]-i][position[1]+i] === side)
                result = result + 10;
            if(this.board[position[0]-i][position[1]+i] === (3-side))
                result = result + 1;
        }
        //console.log(position[0], position[1]);
        //console.log("result"+result);

        if(result === 0) return 7;

        if(result%10 === 0) return tables[result/10];
        if(result < 10) return antitables[result];

        return 0;
    }


    //评分,如果将要下一个side颜色的棋子，那么看看应该下载哪里
    evaluate(side)
    {
        //没有棋子
        //有1-4个自己棋子
        //有1-4个对方棋子
        //其他


        //从所有可能的区域选取
        let to_select = [];
        this.next_block.forEach(function(value){
            let tmp = value.split(',').map(function(item){
                return parseInt(item, 10);
            });
            to_select.push(tmp);
        });

        for(let i = 0; i < to_select.length; i++)
        {
            let cur_piece = to_select[i];
            let sum = 0;

            for(let offset = -4; offset <= 0; offset++)
            {
                //统计纵向
                let tmp_1 = [cur_piece[0]+offset, cur_piece[1]];
                sum = sum + this.evaluate_help_vertical(tmp_1, side);

                //统计横向
                let tmp_2 = [cur_piece[0], cur_piece[1]+offset];
                sum = sum + this.evaluate_help_horizontal(tmp_2, side);

                //统计斜方向1,左上到右下
                let tmp_3 = [cur_piece[0]+offset, cur_piece[1]+offset];
                sum = sum + this.evaluate_help_leap1(tmp_3, side);

                //统计斜方向2,左下到右上
                let tmp_4 = [cur_piece[0]-offset, cur_piece[1]+offset];
                sum = sum + this.evaluate_help_leap2(tmp_4, side);
            }
            to_select[i].score = sum;

        }

        to_select.sort(function (a, b) {
            return b.score - a.score;
        });



        return to_select;
    }


    go_a_step(x, y, side){
        //这里不能下棋
        if(!this.check_valid(x, y)) return false;
        else {
            //下棋
            this.board[x][y] = side;
            this.steps = this.steps + 1;
            //如果在next_block里，要把这个删掉，因为占用了

            if(this.next_block.has(x+','+y)) this.next_block.delete(x+','+y);
            //把这个周围3*3的合法位置都放进来
            for(let i = -1; i < 2; i++)
                for(let j = -1; j < 2; j++)
                {
                    let tmpx = x+i;
                    let tmpy = y+j;
                    if(this.check_valid(tmpx, tmpy))
                        this.next_block.add(tmpx+','+tmpy);
                }
            return true;

        }
    }



    is_win(x, y, side) {
        let i = 0, j = 0;
        while(x+i < this.row && this.board[x+i][y] === side) i++;
        while(x-j >= 0 && this.board[x-j][y] === side) j++;
        if(i + j - 1 >= 5) return true;

        i = 0; j = 0;
        while(y+i < this.col && this.board[x][y+i] === side) i++;
        while(y-j >= 0 && this.board[x][y-j] === side) j++;
        if(i + j - 1 >= 5) return true;

        i = 0; j = 0;
        while(x-i >= 0 && y-i >=0 && this.board[x-i][y-i] === side) i++;
        while(x+j < this.row && y+j < this.col && this.board[x+j][y+j] === side) j++;
        if(i + j - 1 >= 5) return true;

        i = 0; j = 0;
        while(x-i >= 0 && y+i < this.col && this.board[x-i][y+i] === side) i++;
        while(x+j < this.row && y-j >= 0 && this.board[x+j][y-j] === side) j++;
        if(i + j - 1 >= 5) return true;

        return false;
    }

    getRandomIntInclusive(max) {

        max = Math.floor(max);
        return Math.floor(Math.random() * max + 1); //The maximum is inclusive and the minimum is inclusive
    }

    //如果下一步要下一个side颜色的棋子，模拟一下最后是谁赢
    simulation(side) {
        while (this.steps <= this.total_step) {
            let next_step = this.evaluate(side)[0];
            this.go_a_step(next_step[0], next_step[1], side);
            if (this.is_win(next_step[0], next_step[1], side)) return side;
            side = 3-side;
        }
        return 0;
    }
}


class TreeNode {
  constructor(chessboard) {
    this.chessboard = chessboard;
    this.child_nodes = [];
    this.piece = [];
    this.win_times = 0;
    this.test_times = 0;
  }

}

class Tree {
  constructor(chessboard, breadth, depth) {
    this.root = new TreeeNode(chessboard);
    this.breadth = breadth;
    this.depth = depth;
  }

  copyset(set) {
    let newset = new Set();
    set.forEach(function(item){
      newset.add(item);
    })
    return newset;
  }

  expansion(root, depth, simulation_times) {
    if(depth === 0)
    {
      for(let i = 0; i < simulation_times; i++)
      {
        let tmpboard = JSON.parse(JSON.stringify(root.chessboard.board));
        //！这里并不确定！set可不可以这样深拷贝呢？？
        let tmpstep = copyset(root.chessboard.next_block);
        let tmpchess = new ChessBoard()
      }
    }
  }
}


module.exports = ChessBoard;

let myboard = new ChessBoard(15,15);


onmessage = function(e) {
  var d = e.data;
  //console.log(d);
  if(d.type === "START") {
    myboard = new ChessBoard(15,15);
    postMessage({type:"get"});
  }
  if(d.type === "AISTART") {
    myboard = new ChessBoard(15,15);
    myboard.board[7][7] = AISIDE;
    postMessage({type:"GO", x:7, y:7});
  }
  if(d.type === "GO") {

    myboard.go_a_step(d.x, d.y, 1);
    let pieces = myboard.evaluate(AISIDE);
    myboard.go_a_step(pieces[0][0], pieces[0][1], AISIDE);
    //myboard.print_board();
    console.log(pieces);
    postMessage({type:"GO", x: pieces[0][0], y:pieces[0][1]});
  }
}
