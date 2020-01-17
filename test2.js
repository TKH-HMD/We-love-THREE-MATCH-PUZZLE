class Game {
	constructor() {
		this.canvas = document.getElementById('canvas');
		this.context = canvas.getContext('2d');
		this.masuWidth = 30;
		this.gyou = 3;
		this.retsu = 3;
		this.width = this.masuWidth * this.gyou;
		this.height = this.masuWidth * this.retsu;
		canvas.width = this.width;
		canvas.height = this.height;
		this.flame = 0;
		this.masuNoKazu = this.gyou * this.retsu;
		this.cells = [];

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
	generateCell() {
		//ステージ上で見えているパネルを総マス数ぶん
		for (let i = 0; i < this.masuNoKazu * 2; i++) {
			let retsuNo = i % this.retsu;
			let gyouNo = Math.floor(i / this.gyou);
			let type = game.randomNum(5);
			if (i < this.masuNoKazu) {
				this.cells[i] = new Cells(retsuNo * 30, gyouNo * 30, type);
				this.cells[i].visibleF = true;
			} else {
				//ステージ上部で待機している見えないパネルをもうひとセット
				gyouNo -= game.gyou * 2;
				this.cells[i] = new Cells(retsuNo * 30, gyouNo * 30, type);
				this.cells[i].visibleF = false;
			}
		}
	} //generateCell()

	//セルを描画する
	paintCells() {

		context.beginPath();

		// 円の中心座標: (100,100)
		// 半径: 50
		// 開始角度: 0度 (0 * Math.PI / 180)
		// 終了角度: 360度 (360 * Math.PI / 180)
		// 方向: true=反時計回りの円、false=時計回りの円
		context.arc(100, 100, 50, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
	}

} //class game

/*
x :x座標
y :y座標
color:色番号
dropF:落下フラグ
move:アニメーション用の数字。毎フレームmoveSpeedを引き算して０になるまでアニメーションすることにする。セルの縦横幅と同じ
moveSpeed:アニメーション用の数字。一度に動くpixel数
*/
class Cells {

	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.dropF = false;
		this.move = game.masuWidth;
		this.moveSpeed = 1;
		this.type = type;
		this.visibleF = false;
	}
}

let game = new Game;
game.paintBG();
game.generateCell();
