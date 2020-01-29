class Game {
	/*type
	0:red 1:blue 2:green 3:yellow 4:skyblue
	//10~//
	11:タテ一列　12:ヨコ一列　13爆弾
	//20~//
	20:かべ　21:木箱　22草
	//30~//
	31:ひよこ　32くり
	*/

	constructor(gyou, retsu) {
		this.canvas = document.getElementById('canvas');
		this.context = canvas.getContext('2d');
		this.masuWidth = 60;
		this.gyou = gyou;
		this.retsu = retsu;
		this.width = this.masuWidth * this.gyou * 2;
		this.height = this.masuWidth * this.retsu * 2;
		canvas.width = this.width;
		canvas.height = this.height;
		this.flame = 0;
		this.masuNoKazu = this.gyou * this.retsu;
		this.cells = [];
		this.objects = [];
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

	generateObjects() {

		let objs = GetQueryString();
		if (objs === null) return;
		for (let i = 0; i < objs.length; i++) {
			if (objs[i].type < 30) {
				this.objects[i] = new Cell(objs[i].x * this.masuWidth, objs[i].y * this.masuWidth, objs[i].type);
				this.objects[i].visibleF = true;

			} else {
				let cellNo = objs[i].y * game.retsu + objs[i].x;
				game.cells[cellNo].x = objs[i].x * game.masuWidth;
				game.cells[cellNo].y = objs[i].y * game.masuWidth;
				game.cells[cellNo].type = objs[i].type;
			}
		}

	} //generateObjects()

	//フィールド内に非表示のセルが存在する場合、待機セルの一番上に移動させ
	//フィールド最上段が空いている場合は待機セル最下段のものを表示させ、落下判定に引っかかるようにする
	cellsReplace() {
		let idouSaki = -(this.gyou * this.masuWidth) - this.masuWidth;
		let array = [];

		for (let i = 0; i < game.cells.length; i++) {
			if (game.cells[i].y >= 0) {
				//セルが何列目か計算する。
				let x;
				x = game.cells[i].x % game.masuWidth
				//もし非表示ならarray[x]に加算し
				if (!game.cells[i].visibleF) {
					array[x] = array[x] || 0;
					array[x]++;
					//色を振り直し待機列へ
					let count = array[x];
					game.cells[i].y = idouSaki - (count * game.masuWidth);
					game.cells[i].type = game.randomNum(5);
				}
			} //y>0

			//待機列最下段なら
			if (game.cells[i].y === -(game.masuWidth)) {
				game.cells[i].visibleF = true;

			}
		}



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
				if (this.cells[i].type < 10) {
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

				} //if type<10

				if (this.cells[i].type > 10) {
					let x = this.cells[i].x
					let y = this.cells[i].y
					let text;

					switch (this.cells[i].type) {
						case 11:
							this.context.fillStyle = "black";
							text = "◆";
							break;

						case 12:
							this.context.fillStyle = "white";
							text = "◆";
							break;

						case 13:
							this.context.fillStyle = "black";
							text = "●";
							break;

						case 31:
							this.context.fillStyle = "white";
							text = "●";
							break;

						case 32:
							this.context.fillStyle = "#C47222";
							text = "Ж";
							break;

						default:
							break;


					} //switch

					this.context.font = "60px sans-serif";
					this.context.textBaseline = "top";
					this.context.fillText(text, this.cells[i].x, this.cells[i].y);

				} //if type>10


			} //if
			///////////////////////デバッグ用非表示セル表示////////////////

			this.context.font = "10px sans-serif";


			if (!this.cells[i].visibleF) {
				let x = this.cells[i].x + radius // + this.clientRect.left;
				let y = this.cells[i].y + radius // + this.clientRect.top;

				this.context.beginPath();
				this.context.arc(x, y, radius, 0 * Math.PI / 180, 360 * Math.PI / 180, false);

				this.context.strokeStyle = "black";
				this.context.lineWidth = 1;
				this.context.stroke();

			}

			let text = "(" + this.cells[i].x + "," + this.cells[i].y + ")";
			let text2 = "p:(" + this.cells[i].previousX + "," + this.cells[i].previousY + ")";
			let yokehaba = this.masuWidth * this.retsu


			this.context.fillText(i, this.cells[i].x + yokehaba, this.cells[i].y + 10 + this.height / 2);

			this.context.fillText(text, this.cells[i].x + yokehaba, this.cells[i].y + 20 + this.height / 2);

			this.context.fillText(text2, this.cells[i].x + yokehaba, this.cells[i].y + 30 + this.height / 2);

			this.context.fillText("Drag:" + this.cells[i].dragF, this.cells[i].x + yokehaba, this.cells[i].y + 40 + this.height / 2);

			this.context.fillText("RID:" + this.cells[i].disappearGroupRId, this.cells[i].x + yokehaba, this.cells[i].y + 50 + this.height / 2);

			this.context.fillText("CID:" + this.cells[i].disappearGroupCId, this.cells[i].x + yokehaba, this.cells[i].y + 60 + this.height / 2);


			/////////////////////////////

		} //for


	} //paintCells()

	paintUnderlayer() {

		for (let i = 0; i < game.objects.length; i++) {
			if (game.objects[i].type === 22 && game.objects[i].visibleF === true) {
				let x = this.objects[i].x;
				let y = this.objects[i].y;
				this.context.fillStyle = "rgba(" + [255, 255, 255, 0.7] + ")";
				this.context.fillRect(x, y, this.masuWidth, this.masuWidth);
			}
		}

	} //paintUnderlayer()
	paintUpperlayer() {

		for (let i = 0; i < game.objects.length; i++) {
			let x = this.objects[i].x;
			let y = this.objects[i].y;
			if (game.objects[i].visibleF) {
				switch (game.objects[i].type) {
					case 20:
						this.context.fillStyle = "black";
						this.context.fillRect(x, y, this.masuWidth, this.masuWidth);
						break;
					case 21:
						this.context.fillStyle = "#C47222";
						this.context.fillRect(x, y, this.masuWidth, this.masuWidth);
						break;
					default:
						break;
				}

			}
		}

	} //paintUpperlayer()

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
					if (game.cells[cellNo].y === game.cells[i].y + game.masuWidth && game.cells[cellNo].x === game.cells[i].x)
						array['up'] = i;

					if (game.cells[cellNo].y === game.cells[i].y - game.masuWidth && game.cells[cellNo].x === game.cells[i].x)
						array['down'] = i;
					if (game.cells[cellNo].y === game.cells[i].y - game.masuWidth && game.cells[cellNo].x > game.cells[i].x &&
						game.cells[cellNo].x < game.cells[i].x + 30)
						array['down'] = i;

					if (game.cells[cellNo].x === game.cells[i].x - game.masuWidth && game.cells[cellNo].y === game.cells[i].y)
						array['right'] = i;
					if (game.cells[cellNo].x === game.cells[i].x + game.masuWidth && game.cells[cellNo].y === game.cells[i].y)
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
	/*type10~:爆弾・爆竹
			11:縦一列
			12:横一列
			12:爆弾（縦横3マスまでを消す）
	*/
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

		for (let i = 0; i < game.objects.length; i++) {

			if (x > game.objects[i].x &&
				x < game.objects[i].x + game.masuWidth &&
				y > game.objects[i].y &&
				y < game.objects[i].y + game.masuWidth &&
				game.objects[i].visibleF === true
			) {
				if (game.objects[i].type === 20 || game.objects[i].type === 21) {
					return;
				}
			}
		}

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
					//ドラッグしたセルの、ドラッグした方向隣のセルのmoveFを立てる。同じ座標に特定のオブジェクトがあれば取り消す
					let changeCellNo = game.ditectNeighbor(i);
					for (let j = 0; j < game.objects.length; j++) {
						if (game.objects[j].type === 20 || game.objects[j].type === 21) {
							if (game.objects[j].x === game.cells[changeCellNo].x && game.objects[j].y === game.cells[changeCellNo].y) {
								input.mouseUpFunc();
								return;
							}
						}
					}


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
						game.cells[i].moveWay = "";

						//動かしたセルか、入れ替えられたセルが爆弾系（type：10代）なら、作動させる

						let cellNo = 0;
						if (game.cells[i].type > 10) {
							game.cells[i].visibleF = false;
							cellNo = i;
						}

						if (n !== undefined && game.cells[n].type > 10) {
							cellNo = n;
							game.cells[i].visibleF = false;
						}

						let num = check.checker(i);
						if (num > 0 || game.cells[i].type > 10 ||
							game.cells[n].type > 10) {

							game.cells[i].previousX = game.cells[i].x;
							game.cells[n].previousX = game.cells[n].x;
							game.cells[i].previousY = game.cells[i].y;
							game.cells[n].previousY = game.cells[n].y;
						}
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

	checker(moveCell) {

		//グループをリセット
		for (let j = 0; j < game.cells.length; j++) {
			game.cells[j].disappearGroupRId = -1;
			game.cells[j].disappearGroupCId = -1;
		}
		check.RID = 1;
		check.CID = 1;
		//消えた組数を入れる
		let num = 0;

		//表示中で・なおかつ落下中ではない全てのセルの上下左右のタイプを調べグループ化
		//隣のセルが落下中の場合も判定しないようにする(dropCheck)
		//爆弾系セルの爆発判定も同時にする
		for (let j = 0; j < game.cells.length; j++) {
			if (game.cells[j].visibleF === true &&
				game.cells[j].y >= 0 && game.cells[j].dropF === false) check.groupCheck(j);
			if (game.cells[j].type > 10 && game.cells[j].visibleF === false) {
				bombsExplosion(j);
			}

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
				let b = 0;
				for (var j = 0; j < game.cells.length; j++) {
					if (game.cells[j].disappearGroupRId === i) {
						game.cells[j].visibleF = false;

						//もし横並びで４こ揃っていたら
						if (count === 4) {

							if (moveCell === undefined && b === 0) {
								game.cells[j].visibleF = true;
								game.cells[j].type = 11;
								b++
							} else

							if (moveCell !== undefined && game.cells[moveCell].visibleF === false && game.cells[moveCell].disappearGroupRId === i) {
								game.cells[moveCell].visibleF = true;
								game.cells[moveCell].type = 11;

							}

						} //if count=4

						if (count >= 5) {

							if (moveCell === undefined && b === 0) {
								game.cells[j].visibleF = true;
								game.cells[j].type = 13;
								b++
							} else

							if (moveCell !== undefined && game.cells[moveCell].visibleF === false && game.cells[moveCell].disappearGroupRId === i) {
								game.cells[moveCell].visibleF = true;
								game.cells[moveCell].type = 13;

							}
						} //if count＞５

					}

				} //forj
				num++
			}

		} //for i

		//縦並びの同一グループのセルの数を数える
		for (let i = 1; i <= check.CID; i++) {

			let count = 0;

			for (let j = 0; j < game.cells.length; j++) {
				//ひよこが一番下についたら消す
				if (game.cells[j].type === 31 &&
					game.cells[j].y > game.masuWidth * game.gyou
				) {
					game.cells[j].visibleF = false;
				}
				//IDの数を数える
				if (game.cells[j].disappearGroupCId === i) {
					count++
				}
			}

			//同グループのセルの数が３以上なら表示しない
			if (count >= 3) {
				let a = 0;
				for (let j = 0; j < game.cells.length; j++) {
					if (game.cells[j].disappearGroupCId === i) {
						//もし縦横に３つ以上揃っていたら
						if (
							game.cells[j].disappearGroupRId > 0 &&
							game.cells[j].visibleF === false
						) {
							game.cells[j].type = 13;
							game.cells[j].visibleF = true;
						}

						if (game.cells[j].type != 13) game.cells[j].visibleF = false;
						//もし縦並びで４こ揃っていたら
						if (count === 4) {

							if (moveCell === undefined && a === 0) {
								game.cells[j].visibleF = true;
								game.cells[j].type = 12;
								a++
							} else

							if (moveCell !== undefined && game.cells[moveCell].visibleF === false && game.cells[moveCell].disappearGroupCId === i) {
								game.cells[moveCell].visibleF = true;
								game.cells[moveCell].type = 12;

							}
						} //if count=4

						if (count >= 5) {

							if (moveCell === undefined && a === 0) {
								game.cells[j].visibleF = true;
								game.cells[j].type = 13;
								a++
							} else

							if (moveCell !== undefined && game.cells[moveCell].visibleF === false && game.cells[moveCell].disappearGroupCId === i) {
								game.cells[moveCell].visibleF = true;
								game.cells[moveCell].type = 13;

							}
						} //if count＞５

					} //if
				} //forj
				num++
			} //if count>=3
		} //for i

		//オブジェクトの消えるかチェック

		for (let i = 0; i < game.objects.length; i++) {
			if (game.objects[i].type === 22 || game.objects[i].type === 21) {
				if (game.objects[i].visibleF) {

					for (let j = 0; j < game.cells.length; j++) {
						//上下のどちらかのセルが消えたらオブジェクトも消える
						if (game.cells[j].visibleF === false &&
							game.cells[j].y >= 0
						) {

							if (game.cells[j].x === game.objects[i].x) {
								if (game.cells[j].y + game.masuWidth === game.objects[i].y ||
									game.cells[j].y - game.masuWidth === game.objects[i].y ||
									game.cells[j].y === game.objects[i].y) {
									game.objects[i].visibleF = false;
								}

							} else if (game.cells[j].y === game.objects[i].y) {
								if (game.cells[j].x + game.masuWidth === game.objects[i].x ||
									game.cells[j].x - game.masuWidth === game.objects[i].x) {

									game.objects[i].visibleF = false;

								}
							} //else if
						}
						//くりが消えるかチェック

						if (game.cells[j].type === 32) {
							let array = game.ditectNeighbor(j);
							if (array["up"] !== undefined &&
								game.cells[array.up].visibleF === false) game.cells[j].visibleF === false;
							if (array["right"] !== undefined && game.cells[array.right].visibleF === false) game.cells[j].visibleF === false;
							if (array["down"] !== undefined && game.cells[array.down].visibleF === false) game.cells[j].visibleF === false;
							if (array["left"] !== undefined && game.cells[array.left].visibleF === false) game.cells[j].visibleF === false;

						}
					}
				}


			}
		} //for i


		return num;

	} //checker()


	groupCheck(cellNo) {
		//チェック対象の上下左右のセルNoを入れる配列
		let array = game.ditectNeighbor(cellNo);
		//チェック対象のグループID
		let cellId;
		//未グループ同士のセルに付与する新しいID
		let newId;
		//チェック方向
		let arrayWay;
		//チェック方向のセルグループID
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

			//調べる先のセルの上に・または自身の上にオブジェクトが存在する・あるいは自身がオブジェクトか判定
			let Fobject = false;

			if (game.cells[cellNo].type > 30) {
				this.mouseUpFunc;
				Fobject = true;
			}

			for (let j = 0; j < game.objects.length; j++) {
				if (game.objects[j].visibleF === true &&
					game.objects[j].type !== 22
				) {
					if (arrayWay != undefined &&
						game.objects[j].x === game.cells[arrayWay].x && game.objects[j].y === game.cells[arrayWay].y

					) {
						this.mouseUpFunc;
						Fobject = true;
					} else if (
						game.objects[j].x === game.cells[cellNo].x && game.objects[j].y === game.cells[cellNo].y
					) {
						this.mouseUpFunc;
						Fobject = true;
					}
				}
			}

			//隣のセルが存在し、表示中でなおかつ落下中ではない場合・判定先・または自身がオブジェクトではない場合のみ判定
			if (arrayWay != undefined &&
				game.cells[arrayWay].visibleF === true &&
				game.cells[arrayWay].y >= 0 &&
				game.cells[arrayWay].dropF === false &&
				Fobject === false &&
				game.cells[arrayWay].type < 10
			) {

				//左隣とタイプが同じとき
				if (game.cells[cellNo].type === game.cells[arrayWay].type) {

					//チェック対象が未グループ
					if (cellId < 0) {

						//左隣が既グループなら、左隣と同じグループに入る
						if (arrayWayCellId > 0) {
							if (arrayWay === array.left || arrayWay === array.right) {
								game.cells[cellNo].disappearGroupRId = arrayWayCellId;
							}
							if (arrayWay === array.down || arrayWay === array.up) {
								game.cells[cellNo].disappearGroupCId = arrayWayCellId;
							}

						}
						//左隣も未グループなら新しいRグループIDを両方にふる
						if (arrayWayCellId < 0) {
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
						if (arrayWayCellId < 0) {
							if (arrayWay === array.left || arrayWay === array.right) {
								game.cells[arrayWay].disappearGroupRId = cellId;
							}
							if (arrayWay === array.down || arrayWay === array.up) {
								game.cells[arrayWay].disappearGroupCId = cellId;
							}
						}
						//両方とも既グループの場合、大きい方の数字を上書きする

						if (arrayWayCellId > 0) {

							if (arrayWay === array.left || arrayWay === array.right) {

								if (arrayWayCellId > cellId) game.cells[cellNo].disappearGroupRId = game.cells[arrayWay].disappearGroupRId;
								if (arrayWayCellId < cellId) game.cells[arrayWay].disappearGroupRId = cellId;
							}
							if (arrayWay === array.down || arrayWay === array.up) {
								if (arrayWayCellId > cellId) game.cells[cellNo].disappearGroupCId = game.cells[arrayWay].disappearGroupCId;

								if (arrayWayCellId < cellId) game.cells[arrayWay].disappearGroupCId = cellId;
							}
						}
					}

				} //array.left !=undifined
			}

		} //groupCheck()

	}

	dropCheck() {

		let dragging;
		let changing;
		let go = false;
		let Fobject = false;
		let staticF = true;

		//他のセルがドラッグ中であれば変数に入れる
		for (let i = 0; i < game.cells.length; i++) {
			if (game.cells[i].moveWay !== "") {
				dragging = i;
			}
			if (game.cells[i].changeF) {
				changing = i;
			}
		}

		for (let i = 0; i < game.cells.length; i++) {
			go = false;
			Fobject = false;

			//一つ下のセルに当たり判定のあるオブジェクトがないかチェック

			for (let j = 0; j < game.objects.length; j++) {
				if (game.objects[j].x === game.cells[i].x && game.objects[j].y - game.masuWidth === game.cells[i].y &&
					game.objects[j].visibleF === true
				) {

					if (game.objects[j].type < 22) {
						Fobject = true;
						game.cells[i].dropF = false;
					}
				}
				if (game.objects[j].x === game.cells[i].x && game.objects[j].y === game.cells[i].y &&
					game.objects[j].visibleF === true) {

					if (game.objects[j].type < 22) {
						Fobject = true;
						game.cells[i].dropF = false;
					}
				}

			} //fotj

			//もし自身と下のセルがドラッグ中でなく、一つ下にオブジェクトがないなら
			if (!Fobject) {
				if (dragging === undefined || changing === undefined) {
					go = true;
				} else if (i !== dragging &&
					i !== changing &&
					game.cells[i].x !== game.cells[dragging].previousX &&
					game.cells[i].x !== game.cells[changing].previousX
				) {
					go = true;
				}
			}
			if (go) {
				let array = game.ditectNeighbor(i);

				//一つ下のセルと接していない状態なら自身も落下する
				if (array.down == undefined) {
					/*if (game.cells[i].y < (game.gyou - 1) * game.masuWidth) {*/
					game.cells[i].dropF = true;

					//}
				}


				if (array.down !== undefined) {
					//一つ下のセルが落ち始めたら自身も落下を始める
					if ( /*game.cells[array.down].visibleF === false ||*/ game.cells[array.down].dropF === true) {
						game.cells[i].dropF = true;
					}
					//一つ下のセルが落下中でなければ止まる
					if ( /*game.cells[array.down].visibleF === true && */ game.cells[array.down].dropF === false |
						Fobject === true) {
						game.cells[i].dropF = false;
					}
				}

				if (game.cells[i].dropF === true) {
					staticF = false;
					game.cells[i].y += game.cells[i].moveSpeed;
					game.cells[i].previousY = game.cells[i].y;

				}

				//フィールドの一番下についたら止まる
				if (game.cells[i].y > (game.gyou - 1) * game.masuWidth &&
					game.cells[i].type !== 31) {
					game.cells[i].y = (game.gyou - 1) * game.masuWidth
					game.cells[i].previousY = (game.gyou - 1) * game.masuWidth
					game.cells[i].dropF = false;
				}
				//}
				//自身が表示中か

			}
		} //for

		//セルが落ち切って動きが無いとき
		if (staticF) {
			for (var i = 0; i < game.cells.length; i++) {
				for (var j = 0; j < game.cells.length; j++) {
					//cells[i]の左上に位置しているセルが存在するかチェック
					if (game.cells[i].x + game.masuWidth !== game.cells[j].x &&
						game.cells[i].y + game.masuWidth !== game.cells[j].y
					) {
						game.cells[i].y += game.masuWidth;
						game.cells[i].x += game.masuWidth;
					}

				}
			}
		} //if(staticF)

	} //dropCheck()

	cellKaburiDetect() {

		for (let i = 0; i < game.cells.length; i++) {

			for (let j = 0; j < game.cells.length; j++) {
				//セル番号iとjが同じではなく、ドラッグ中ではない
				if (i != j &&
					game.cells[i].dragF === false &&
					game.cells[j].dragF === false &&
					game.cells[i].changeF === false &&
					game.cells[j].changeF === false

				) {
					//被ったら待機列一番上に飛ばす
					if (game.cells[j].y < game.cells[i].y &&
						game.cells[i].y < game.cells[j].y + game.masuWidth &&
						game.cells[i].x === game.cells[j].x
					) {
						game.cells[j].y = -(game.masuWidth * game.gyou);
					}
					//
					if (game.cells[i].y === game.cells[j].y &&
						game.cells[i].x === game.cells[j].x
					) {
						game.cells[j].y = -(game.masuWidth * game.gyou);
					}
				}
			}
		}

	} //func cellKaburiDetect()


} //class Check


let game = new Game;
let input = new Input;
let check = new Check;

//URLから行列数のみ取得
(function () {
	let gyouretsu = GetQueryString("gyouretsu")
	if (gyouretsu != null) {
		game = new Game(gyouretsu[0].gyou, gyouretsu[0].retsu);
	}
}());

game.generateCells();
game.generateObjects();

function bombsExplosion(cellNo) {


	switch (game.cells[cellNo].type) {
		case 11:
			for (let j = 0; j < game.cells.length; j++) {
				if (game.cells[j].x === game.cells[cellNo].x &&
					game.cells[j].type !== 31) game.cells[j].visibleF = false;
			}
			break;

		case 12:
			for (let j = 0; j < game.cells.length; j++) {
				if (game.cells[j].y === game.cells[cellNo].y &&
					game.cells[j].type !== 31) game.cells[j].visibleF = false;
			}
			break;

		case 13:
			for (let j = 0; j < game.cells.length; j++) {
				if (game.cells[j].y >= game.cells[cellNo].y - (game.masuWidth * 2) &&
					game.cells[j].y <= game.cells[cellNo].y + (game.masuWidth * 2) &&
					game.cells[j].x >= game.cells[cellNo].x - (game.masuWidth * 2) &&
					game.cells[j].x <= game.cells[cellNo].x + (game.masuWidth * 2) &&
					game.cells[j].type !== 31) {
					game.cells[j].visibleF = false;

					if (game.cells[j].y === game.cells[cellNo].y - (game.masuWidth * 2) && game.cells[j].x === game.cells[cellNo].x - (game.masuWidth * 2)) {

						game.cells[j].visibleF = true;

					} else if (game.cells[j].y === game.cells[cellNo].y - (game.masuWidth * 2) && game.cells[j].x === game.cells[cellNo].x + (game.masuWidth * 2)) {

						game.cells[j].visibleF = true;

					} else if (game.cells[j].y === game.cells[cellNo].y + (game.masuWidth * 2) && game.cells[j].x === game.cells[cellNo].x - (game.masuWidth * 2)) {

						game.cells[j].visibleF = true;

					} else
					if (game.cells[j].y === game.cells[cellNo].y + (game.masuWidth * 2) && game.cells[j].x === game.cells[cellNo].x + (game.masuWidth * 2)) {

						game.cells[j].visibleF = true;

					}
				}
			}
			break;

		default:
			break;
	}

}


//渡した引数で行列数のみ取得するかオブジェクトのみ取得するか分岐するようにする
function GetQueryString(F) {

	let flag = F || null
	let URLQuery = document.location.search;
	let queryBlock = [];
	let query = "";
	let objectParam = [];
	let mojisu;

	if (1 < URLQuery.length) {

		URLQuery = URLQuery.substr(1);

		//パラメータが12桁よりも大きければ、12桁ごとに分割して１０進数の整数に戻し、文字列にした後合体させる。

		if (URLQuery.length > 12) {
			let block = []
			let bunkatsuSu = Math.ceil(URLQuery.length / 12);
			for (let i = 0; i < bunkatsuSu; i++) {
				block[i] = URLQuery.substr(i * 12, 12)
				block[i] = parseInt(block[i], 16);
				block[i] = block[i].toString(10);
				if (i != bunkatsuSu - 1) {
					block[i] = ("000" + block[i]).slice(-15);
				} else {
					let ketasu = parseInt(block[0].substr(0, 3));
					let hasuKeta = ketasu % 15;
					block[i] = ("000" + block[i]).slice(-(hasuKeta));
				}
				query += block[i]
			}
		} else {

			query = parseInt(URLQuery, 16)
			query = ("0" + String(query));
		}


		//引数が"gyouretsu"なら、行・列数のみ計算して返す
		if (flag === "gyouretsu") {
			let retsuToGyouParam = query.substr(3, 4);
			objectParam[0] = [];
			objectParam[0].gyou = parseInt(retsuToGyouParam.substr(0, 2));
			objectParam[0].retsu = parseInt(retsuToGyouParam.substr(2, 2));

			return objectParam;

		}



		//オブジェクトの数を割り出す。ひとつのオブジェクトにつき2桁のパラメータを３つ持っている。
		let NumOfobject = Math.ceil((query.length - 7) / 6);

		//パラメータを６文字ごとに切り出し、さらに2文字ずつ分割して整数化し、オブジェクトのパラメーターとして配列に入れていく。
		for (let i = 0; i < NumOfobject; i++) {
			queryBlock[i] = query.substr(6 * i + 7, 6);
			objectParam[i] = [];
			objectParam[i].type = parseInt(queryBlock[i].substr(0, 2));
			objectParam[i].x = parseInt(queryBlock[i].substr(2, 2));
			objectParam[i].y = parseInt(queryBlock[i].substr(4, 2));
		}

		return objectParam;

	}

	return null;

} //func GetQueryString()

function main() {
	game.paintBG();
	check.checker();
	check.dropCheck();
	check.cellKaburiDetect();
	game.paintUnderlayer();
	game.paintCells();
	game.paintUpperlayer();
	game.cellsReplace();
	requestAnimationFrame(main);
}

main();

addEventListener("mousedown", input.mouseDownfunc, false);
addEventListener("mousemove", input.mouseMoveFunc, false);
addEventListener("mouseup", input.mouseUpFunc, false);
