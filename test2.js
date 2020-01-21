class Game {
	constructor() {
		this.canvas = document.getElementById('canvas');
		this.context = canvas.getContext('2d');
		this.masuWidth = 60;
		this.gyou = 3;
		this.retsu = 3;
		this.width = this.masuWidth * this.gyou;
		this.height = this.masuWidth * this.retsu * 2;
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

	cellsReplace() {

	}

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

				this.context.fillText(i, this.cells[i].x, this.cells[i].y + 10 + this.height / 2);
				this.context.fillText(this.cells[i].dropF, this.cells[i].x, this.cells[i].y + 40 + this.height / 2);

			} //if

		} //for


	} //paintCells()

	//moveWay = true =>ドラッグ時、ドラッグ方向のセル番号を返す
	//moveWay = "" =>指定セル番号の上下左右のセル番号を連想配列にいれて返す。
	ditectNeighbor(cellNo) {
		let array = [];
		for (let i = 0; i < game.cells.length; i++) {
			switch (game.cells[cellNo].moveWay) {
				case "left":
					if (game.cells[cellNo].previousX === game.cells[i].x + game.masuWidth && game.cells[cellNo].previousY === game.cells[i].y) {
						game.cells[i].changeF = true;
						game.cells[i].previousX = game.cells[i].x
						return i;
						break;
					}
					break;
				case "right":
					if (game.cells[cellNo].previousX === game.cells[i].x - game.masuWidth && game.cells[cellNo].previousY === game.cells[i].y) {
						game.cells[i].changeF = true;
						game.cells[i].previousX = game.cells[i].x
						return i;
						break;
					}
					break;
				case "up":
					if (game.cells[cellNo].previousY === game.cells[i].y + game.masuWidth && game.cells[cellNo].previousX === game.cells[i].x) {
						game.cells[i].changeF = true;
						game.cells[i].previousY = game.cells[i].y
						return i;
						break;
					}
					break;
				case "down":
					if (game.cells[cellNo].previousY === game.cells[i].y - game.masuWidth && game.cells[cellNo].previousX === game.cells[i].x) {
						game.cells[i].changeF = true;
						game.cells[i].previousY = game.cells[i].y
						return i;
						break;
					}
					break;
				default:
					if (game.cells[cellNo].previousY === game.cells[i].y + game.masuWidth && game.cells[cellNo].previousX === game.cells[i].x)
						array['up'] = i;
					if (game.cells[cellNo].previousY === game.cells[i].y - game.masuWidth && game.cells[cellNo].previousX === game.cells[i].x)
						array['down'] = i;
					if (game.cells[cellNo].previousX === game.cells[i].x - game.masuWidth && game.cells[cellNo].previousY === game.cells[i].y)
						array['right'] = i;
					if (game.cells[cellNo].previousX === game.cells[i].x + game.masuWidth && game.cells[cellNo].previousY === game.cells[i].y)
						array['left'] = i;
			} //switch
		} //for
		return array;
	} //ditectNeighbor()


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
		this.previousX = x;
		this.previousY = y;
		this.dropF = false;
		this.dragF = false;
		this.move = game.masuWidth;
		this.moveWay = "";
		this.changeF = false;
		this.moveSpeed = 1;
		this.type = type;
		//-1はグループ未判定、-2は消滅グループ外、消えるグループができたら1から順に割り当てていく
		this.disappearGroupRId = -1;
		this.disappearGroupCId = -1;
		this.visibleF = false;
	}
}

class Input {
	constructor() {
		this.previousClickX = 0;
		this.previousClickY = 0;
		this.previousCursorX = 0
		this.previousCursorY = 0
	}

	mouseDownfunc(event) {
		//マウスボタンが押された時のカーソルの絶対座標を取得
		let clickX = event.pageX;
		let clickY = event.pageY;
		//相対座標を計算する
		let x = clickX - game.clientRect.left;
		let y = clickY - game.clientRect.top;

		//もしマウスダウン時のカーソル座標がセルの領域内で、なおかつ落下中でなく、画面に表示されていればドラッグフラグを立てる

		for (let i = 0; i < game.cells.length; i++) {
			if (x > game.cells[i].x &&
				x < game.cells[i].x + game.masuWidth &&
				y > game.cells[i].y &&
				y < game.cells[i].y + game.masuWidth &&
				game.cells[i].dropF === false &&
				game.cells[i].visibleF === true
			) {
				game.cells[i].dragF = true;
				this.previousClickX = x;
				this.previousClickY = y;
				this.previousCursorX = x;
				this.previousCursorY = y;
				game.cells[i].previousX = game.cells[i].x;
				game.cells[i].previousY = game.cells[i].y;

			}
		}

	} //mouseDownfunc()

	mouseUpFunc(event) {

		//マウスボタンが離された時、セルを元の座標に戻してフラグを初期化する
		for (let i = 0; i < game.cells.length; i++) {
			if (game.cells[i].dragF === true) {

				game.cells[i].x = game.cells[i].previousX;
				game.cells[i].y = game.cells[i].previousY;
				game.cells[i].dragF = false;
				game.cells[i].moveWay = "";
				game.cells[i].move = game.masuWidth;
			} //if
			if (game.cells[i].changeF === true) {

				game.cells[i].x = game.cells[i].previousX;
				game.cells[i].y = game.cells[i].previousY;
				game.cells[i].changeF = false;

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
				let moveX = x - previousCursorX;
				let moveY = y - previousCursorY;

				//console.log(dragDistanceX, dragDistanceY);
				//console.log(moveX, moveY);

				//まだmoveWayが空の時は、最初にドラックされた方向を計算して入れる
				if (game.cells[i].moveWay === "") {

					if (Math.abs(dragDistanceX) > Math.abs(dragDistanceY)) {
						if (dragDistanceX > 0) {
							game.cells[i].moveWay = "right";
						} else {
							game.cells[i].moveWay = "left";
						}
					} else if (Math.abs(dragDistanceX) < Math.abs(dragDistanceY)) {

						if (dragDistanceY > 0) {
							game.cells[i].moveWay = "down";
						} else {
							game.cells[i].moveWay = "up";
						}
					}
					//ドラッグしたセルの、ドラッグした方向隣のセルのmoveFを立てる
					game.ditectNeighbor(i);

				} //if!moveWay
				else {
					//moveWayに方向が入れられていたら、その方向にのみセルを動かす。その方向にあるセルは、逆に動く

					//入れ替えフラグが立っているセル番号をnにいれる
					var n = (function () {
						for (let i = 0; i < game.cells.length; i++) {

							if (game.cells[i].changeF === true) {
								return i;
							}

						}
					}());

					//もし動かした先に入れ替えられるセルがあれば
					if (n !== undefined) {

						switch (game.cells[i].moveWay) {

							case "right":
								if (dragDistanceX = 0) game.cells[i].moveWay = "";
								if (moveX < 0) {
									//game.cells[i].moveWay = "left";
									input.mouseUpFunc();
									break;
								}
								game.cells[i].x += game.cells[i].moveSpeed;
								game.cells[n].x -= game.cells[n].moveSpeed;


								break;
							case "left":
								if (dragDistanceX = 0) game.cells[i].moveWay = "";
								if (moveX > 0) {
									//game.cells[i].moveWay = "right";
									input.mouseUpFunc();
									break;
								}
								game.cells[i].x -= game.cells[i].moveSpeed;
								game.cells[n].x += game.cells[n].moveSpeed;

								break;
							case "up":
								if (dragDistanceY = 0) game.cells[i].moveWay = "";
								if (moveY > 0) {
									//game.cells[i].moveWay = "down";
									input.mouseUpFunc();
									break;
								}
								game.cells[i].y -= game.cells[i].moveSpeed;
								game.cells[n].y += game.cells[n].moveSpeed;

								break;
							case "down":
								if (dragDistanceY = 0) game.cells[i].moveWay = "";
								if (moveY < 0) {
									//game.cells[i].moveWay = "up";
									input.mouseUpFunc();
									break;
								}
								game.cells[i].y += game.cells[i].moveSpeed;
								game.cells[n].y -= game.cells[n].moveSpeed;

								break;
							default:
								break;

						} //switch

					} //if(n)

					//次回呼び出しの時に前回の座標として使えるようにpreviousCursorXYに入れておく
					previousCursorX = x;
					previousCursorY = y;



					//セルの座標が画面外になったら、画面端に座標をもどし、移動量も加算しない
					//画面内なら移動量のみ加算
					if (game.cells[i].x < 0) {
						game.cells[i].x = 0;
					} else
					if (game.cells[i].x > game.width - game.masuWidth) {
						game.cells[i].x = game.width - game.masuWidth;
					} else
					if (game.cells[i].y < 0) {
						game.cells[i].y = 0;
					} else
					if (game.cells[i].y > game.height - game.masuWidth) {
						game.cells[i].y = game.height - game.masuWidth;
					} else {
						game.cells[i].move -= game.cells[i].moveSpeed;
					}

					//もし移動量がセル幅に達したらセルの入れ替えを固定し、関連フラグもリセットする

					if (game.cells[i].move === 0) {
						game.cells[i].previousX = game.cells[i].x;
						game.cells[n].previousX = game.cells[n].x;
						game.cells[i].previousY = game.cells[i].y;
						game.cells[n].previousY = game.cells[n].y;
						input.mouseUpFunc();
					}

				} //else

			} //ifdragF
		} //for
	} //mouseMoveFunc()
} //class Input

class Check {

	constructor() {
		//
		this.RID = 1;
		this.CID = 1;
	}

	checker() {
		//グループをリセット
		for (let j = 0; j < game.cells.length; j++) {
			game.cells[j].disappearGroupRId = -1;
			game.cells[j].disappearGroupCId = -1;
		}
		check.RID = 1;
		check.CID = 1;

		//全てのセルの上下左右のタイプを調べグループ化
		for (let j = 0; j < game.cells.length; j++) {
			if (game.cells[j].visibleF === true) check.groupCheck(j);
		}

		//横並びの同一グループのセルの数を数える
		for (let i = 1; i <= check.RID; i++) {

			let count = 0;

			for (let j = 0; j < game.cells.length; j++) {
				if (game.cells[j].disappearGroupRId === i) {
					count++
				}
			}

			//同グループのセルの数が３以上なら表示しない
			if (count >= 3) {
				for (let j = 0; j < game.cells.length; j++) {
					if (game.cells[j].disappearGroupRId === i) {
						game.cells[j].visibleF = false;
					}
				}
			}
		} //for i

		//縦並びの同一グループのセルの数を数える
		for (let i = 1; i <= check.CID; i++) {

			let count = 0;

			for (let j = 0; j < game.cells.length; j++) {
				if (game.cells[j].disappearGroupCId === i) {
					count++
				}
			}

			//同グループのセルの数が３以上なら表示しない
			if (count >= 3) {
				for (let j = 0; j < game.cells.length; j++) {
					if (game.cells[j].disappearGroupCId === i) {
						game.cells[j].visibleF = false;
					}
				}
			}
		} //for i

	} //checker()


	groupCheck(cellNo) {
		let array = game.ditectNeighbor(cellNo);
		let cellId;
		let newId;
		let arrayWay;
		let arrayWayCellId;
		for (let i = 1; i <= 4; i++) {
			switch (i) {
				case 1:
					if (array['left'] != undefined) {
						cellId = game.cells[cellNo].disappearGroupRId;
						newId = check.RID;
						arrayWay = array['left'];
						arrayWayCellId = game.cells[arrayWay].disappearGroupRId;
						break;
					}
					break
				case 2:
					if (array['right'] != undefined) {
						cellId = game.cells[cellNo].disappearGroupRId;
						newId = check.RID;
						arrayWay = array.right;
						arrayWayCellId = game.cells[array.right].disappearGroupRId;
						break;
					}
					break;
				case 3:
					if (array['up'] != undefined) {
						cellId = game.cells[cellNo].disappearGroupCId;
						newId = check.CID;
						arrayWay = array.up;
						arrayWayCellId = game.cells[array.up].disappearGroupCId;
						break;
					}
					break
				case 4:
					if (array['down'] != undefined) {
						cellId = game.cells[cellNo].disappearGroupCId;
						newId = check.CID;
						arrayWay = array.down;
						arrayWayCellId = game.cells[array.down].disappearGroupCId;
						break;
					}
					break
			}
			//隣のセルが存在し、なおかつ表示中の場合のみ判定
			if (arrayWay != undefined && game.cells[arrayWay].visibleF === true) {
				//左隣とタイプが同じとき
				if (game.cells[cellNo].type === game.cells[arrayWay].type) {

					//チェック対象が未グループ
					if (cellId < 0) {

						//左隣が既グループなら、左隣と同じグループに入る
						if (game.cells[arrayWay].disappearGroupRId > 0) {
							if (arrayWay === array.left || arrayWay === array.right) {
								game.cells[cellNo].disappearGroupRId = arrayWayCellId;
							}
							if (arrayWay === array.down || arrayWay === array.up) {
								game.cells[cellNo].disappearGroupCId = arrayWayCellId;
							}

						}
						//左隣も未グループなら新しいRグループIDを両方にふる
						if (game.cells[arrayWay].disappearGroupRId < 0) {
							if (arrayWay === array.left || arrayWay === array.right) {
								game.cells[cellNo].disappearGroupRId = newId;
								game.cells[arrayWay].disappearGroupRId = newId;

								check.RID++;
							}
							if (arrayWay === array.down || arrayWay === array.up) {
								game.cells[cellNo].disappearGroupCId = newId;
								game.cells[arrayWay].disappearGroupCId = newId;
								check.CID++;
							}
						}
					} //チェック対象未グループおわり

					//チェック対象が既グループ
					if (cellId > 0) {

						//左隣が未グループなら、左隣をチェック対象と同じグループに入れる
						if (game.cells[arrayWay].disappearGroupRId < 0) {
							if (arrayWay === array.left || arrayWay === array.right) {
								game.cells[arrayWay].disappearGroupRId = cellId;
							}
							if (arrayWay === array.down || arrayWay === array.up) {
								game.cells[arrayWay].disappearGroupCId = cellId;
							}
							//両方既グループの場合はそのまま
						}
						//チェック対象既グループおわり

					} //左隣とタイプが同じとき おわり

				} //array.left !=undifined
			}

		} //groupCheck()

	}

	dropCheck() {

		let stop = 0;

		//他のセルがドラッグ中であればstop++
		for (let i = 0; i < game.cells.length; i++) {
			if (game.cells[i].moveWay !== "") {
				stop++;
			}
		}


		if (stop === 0) {
			for (let i = 0; i < game.cells.length; i++) {

				//もし自身が表示中で
				//if (game.cells[i].visibleF === true) {

				let array = game.ditectNeighbor(i);


				if (array.down == undefined) {
					if (game.cells[i].y < (game.gyou - 1) * game.masuWidth) {
						game.cells[i].dropF = true;
					}
				}

				if (array.down !== undefined) {
					//一つ下のセルが落ち始めたら自身も落下を始める
					if (game.cells[array.down].visibleF === false || game.cells[array.down].dropF === true) {
						game.cells[i].dropF = true;
					}
					//一つ下のセルが表示中で、落下中でなければ止まる
					if (game.cells[array.down].visibleF === true && game.cells[array.down].dropF === false) {
						game.cells[i].dropF = false;
					}
				}

				if (game.cells[i].dropF === true) {

					game.cells[i].y += game.cells[i].moveSpeed;
					game.cells[i].previousY = game.cells[i].y;

				}

				//フィールドの一番下についたら止まる
				if (game.cells[i].y > (game.gyou - 1) * game.masuWidth) {
					game.cells[i].y = (game.gyou - 1) * game.masuWidth
					game.cells[i].dropF = false;
				}

				//非表示のセルは一旦フィールド外に出して待機させる
				if (game.cells[i].visibleF === false) {
					game.cells[i].x += game.width;
				}
				//}自身が表示中か
			} //for
		} //if !stop

	} //dropCheck()

} //class Check


let game = new Game;
let input = new Input;
let check = new Check;

game.generateCells();

function main() {
	game.paintBG();
	check.checker();
	check.dropCheck();
	game.paintCells();
	requestAnimationFrame(main);
}

main();

addEventListener("mousedown", input.mouseDownfunc, false);
addEventListener("mousemove", input.mouseMoveFunc, false);
addEventListener("mouseup", input.mouseUpFunc, false);
