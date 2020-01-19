class Game {
	constructor() {
		this.canvas = document.getElementById('canvas');
		this.context = canvas.getContext('2d');
		this.masuWidth = 60;
		this.gyou = 3;
		this.retsu = 3;
		this.width = this.masuWidth * this.gyou;
		this.height = this.masuWidth * this.retsu;
		canvas.width = this.width;
		canvas.height = this.height;
		this.flame = 0;
		this.masuNoKazu = this.gyou * this.retsu;
		this.cells = [];
		//canvas要素の座標を取得
		this.clientRect = document.getElementById('canvas').getBoundingClientRect();

	} //constructor

	//背景の描画
	paintBG() {
		//灰色で背景塗りつぶし
		this.context.fillStyle = "#aaa";
		//ステージ全体を描画
		this.context.fillRect(0, 0, this.width, this.height);
		//マス目の線の描画
		this.context.fillStyle = "#000";
		for (let i = 1; i <= this.gyou; i++) {
			this.context.beginPath();
			this.context.moveTo(0, i * this.masuWidth);
			this.context.lineTo(this.width, i * this.masuWidth);
			this.context.stroke();
			for (let j = 0; j < this.retsu; j++) {
				this.context.beginPath();
				this.context.moveTo(j * this.masuWidth, 0);
				this.context.lineTo(j * this.masuWidth, this.height);
				this.context.stroke();
			} //fori
		} //forj
	} //paintBG()

	//0~-(num)までの整数をランダムに返す
	randomNum(num) {
		return Math.floor(Math.random() * num);
	}

	//セルを生成し、初期位置に配置。総マス数の2倍つくる
	generateCells() {
		//ステージ上で見えているパネルを総マス数ぶん
		for (let i = 0; i < this.masuNoKazu * 2; i++) {
			let retsuNo = i % this.retsu;
			let gyouNo = Math.floor(i / this.gyou);
			let type = game.randomNum(5);
			if (i < this.masuNoKazu) {
				this.cells[i] = new Cell(retsuNo * this.masuWidth, gyouNo * this.masuWidth, type);
				this.cells[i].visibleF = true;
			} else {
				//ステージ上部で待機している見えないパネルをもうひとセット
				gyouNo -= game.gyou * 2;
				this.cells[i] = new Cell(retsuNo * this.masuWidth, gyouNo * this.masuWidth, type);
				this.cells[i].visibleF = false;
			}
		}
	} //generateCell()

	//セルを描画する
	paintCells() {

		// 円の中心座標: (x,y)
		// 半径: radius = this.masuWidth /2
		// 開始角度: 0度 (0 * Math.PI / 180)
		// 終了角度: 360度 (360 * Math.PI / 180)
		// 方向: true=反時計回りの円、false=時計回りの円
		let radius = this.masuWidth / 2;
		for (let i = 0; i < this.cells.length; i++) {
			//もしセルが消えていない状態なら
			if (this.cells[i].visibleF) {
				let x = this.cells[i].x + radius // + this.clientRect.left;
				let y = this.cells[i].y + radius // + this.clientRect.top;

				this.context.beginPath();
				this.context.arc(x, y, radius, 0 * Math.PI / 180, 360 * Math.PI / 180, false);

				switch (this.cells[i].type) {

					case 0:
						this.context.fillStyle = "red";
						break;
					case 1:
						this.context.fillStyle = "blue";
						break;
					case 2:
						this.context.fillStyle = "green";
						break;
					case 3:
						this.context.fillStyle = "#ff0";
						break;
					case 4:
						this.context.fillStyle = "#0ff";
						break;

				} //switch

				this.context.fill()

			} //if

		} //for


	} //paintCells()

	ditectNeighbor() {
		for (let i = 0; i < game.cells.length; i++) {
			for (let j = 0; j < game.cells.length; j++) {
				if (game.cells[i].x = game.cells[j].x + 30) {}
			}
		}
	}

} //class game

/*
x :x座標
y :y座標
type:色番号
dropF:落下フラグ
move:アニメーション用の数字。毎フレームmoveSpeedを引き算して０になるまでアニメーションすることにする。セルの縦横幅と同じ
moveSpeed:アニメーション用の数字。一度に動くpixel数
*/
class Cell {

	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.dropF = false;
		this.dragF = false;
		this.move = game.masuWidth;
		this.moveWay = "";
		this.moveSpeed = 1;
		this.type = type;
		//
		this.ditect = -1;
		this.visibleF = false;
	}
}

class Input {
	constructor() {
		this.previousClickX = 0;
		this.previousClickY = 0;
		this.previousX = 0
		this.previousY = 0
	}

	mouseDownfunc(event) {
		//マウスボタンが押された時のカーソルの絶対座標を取得
		let clickX = event.pageX;
		let clickY = event.pageY;
		//相対座標を計算する
		let x = clickX - game.clientRect.left;
		let y = clickY - game.clientRect.top;

		//もしマウスダウン時のカーソル座標がセルの領域内で、なおかつ落下中でなければドラッグフラグを立てる

		for (let i = 0; i < game.cells.length; i++) {
			if (x > game.cells[i].x &&
				x < game.cells[i].x + game.masuWidth &&
				y > game.cells[i].y &&
				y < game.cells[i].y + game.masuWidth &&
				game.cells[i].dropF === false) {
				game.cells[i].dragF = true;
				this.previousClickX = x;
				this.previousClickY = y;
				this.previousX = x;
				this.previousY = y;

			}
		}

	} //mouseDownfunc()

	mouseUpFunc(event) {

		//マウスボタンが離された時、セルを元の座標に戻してフラグを初期化する
		for (let i = 0; i < game.cells.length; i++) {
			if (game.cells[i].dragF === true) {
				//ドラッグでの移動量
				let dragMove = game.masuWidth - game.cells[i].move;

				switch (game.cells[i].moveWay) {

					case "right":
						game.cells[i].x -= dragMove;
						break;
					case "left":
						game.cells[i].x += dragMove
						break;
					case "up":
						game.cells[i].y += dragMove;
						break;
					case "down":
						game.cells[i].y -= dragMove;
						break;
					default:
						break;

				} //switch

				game.cells[i].dragF = false;
				game.cells[i].moveWay = "";
				game.cells[i].move = game.masuWidth;
			} //if
		} //for

	} //moveUpFunc

	mouseMoveFunc(event) {
		for (let i = 0; i < game.cells.length; i++) {
			//ドラッグされた時
			if (game.cells[i].dragF === true) {

				//カーソルの絶対座標を取得しなおす
				let clickX = event.pageX;
				let clickY = event.pageY;
				//相対座標も計算しなおす
				let x = clickX - game.clientRect.left;
				let y = clickY - game.clientRect.top;
				//ドラッグ開始座標からの移動距離を計算
				let dragDistanceX = x - previousClickX;
				let dragDistanceY = y - previousClickY;
				//前回カーソルが動いた時との座標の差を計算
				let moveX = x - previousX;
				let moveY = x - previousY;

				//console.log(dragDistanceX, dragDistanceY);

				//まだmoveWayが空の時は、最初にドラックされた方向を計算して入れる
				if (game.cells[i].moveWay === "") {

					if (Math.abs(dragDistanceX) > Math.abs(dragDistanceY)) {
						if (dragDistanceX > 0) {
							game.cells[i].moveWay = "right";
						} else {
							game.cells[i].moveWay = "left";
						}
					} else if (Math.abs(dragDistanceX) < Math.abs(dragDistanceY)) {

						if (moveY > 0) {
							game.cells[i].moveWay = "down";
						} else {
							game.cells[i].moveWay = "up";
						}
					}
				} //if!moveWay
				else {
					//moveWayに方向が入れられていたら、その方向にのみセルを動かす。その方向にあるセルは、逆に動く

					switch (game.cells[i].moveWay) {

						case "right":
							game.cells[i].x += game.cells[i].moveSpeed;

							break;
						case "left":
							game.cells[i].x -= game.cells[i].moveSpeed;

							break;
						case "up":
							game.cells[i].y -= game.cells[i].moveSpeed;

							break;
						case "down":
							game.cells[i].y += game.cells[i].moveSpeed;

							break;
						default:
							break;

					} //switch

					//移動量記録
					game.cells[i].move -= game.cells[i].moveSpeed;



					//セルの座標が画面外になったら、画面端に座標をもどし、移動量もリセットする
					if (game.cells[i].x < 0) {
						game.cells[i].x = 0;
						game.cells[i].move = game.masuWidth;
					}
					if (game.cells[i].x > game.width - game.masuWidth) {
						game.cells[i].x = game.width - game.masuWidth;
						game.cells[i].move = game.masuWidth;
					}
					if (game.cells[i].y < 0) {
						game.cells[i].y = 0;
						game.cells[i].move = game.masuWidth;
					}
					if (game.cells[i].y > game.height - game.masuWidth) {
						game.cells[i].y = game.height - game.masuWidth;
						game.cells[i].move = game.masuWidth;
					}


				} //else

			} //ifdragF
		} //for
	} //mouseMoveFunc()
} //class Input

let game = new Game;
let input = new Input;

game.generateCells();

function main() {
	game.paintBG();
	game.paintCells();
	requestAnimationFrame(main);
}

main();

addEventListener("mousedown", input.mouseDownfunc, false);
addEventListener("mousemove", input.mouseMoveFunc, false);
addEventListener("mouseup", input.mouseUpFunc, false);
