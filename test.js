/*0115めも
  
  セルの落下判定とアニメーションまではできた。
  次回はスリーマッチパズルの体を成すくらいまで持っていきたい…！
  具体的には
  ・マウスドラッグでのセルの入れ替え
  ・消滅判定まで
  ・あわよくば爆弾と爆竹の生成と実行まで
  
　　その他ギミックは高望みかな…

*/

var canvas = document.getElementById('canvas');
canvas.width = 310;
canvas.height = 600;
var context = canvas.getContext('2d');
//黒で背景塗りつぶし
context.fillStyle = "#000";
//座標（０，０にセル幅・高さ×行・列数＋１０の四角形を描画）
context.fillRect(0, 0, 310, 310);

var cellWidth = 30;
var cellHeight = 30;

var cellGyou = 10;
var cellRetsu = 10;
var cells = [];
var cellType = 5;

class Cells {
	constructor(x, y) {
		this.x = x * cellWidth;
		this.y = y * cellHeight;
		this.dropF = false;
		this.move = cellHeight;
		this.moveSpeed = 1;
		this.color = 0;
	}
}

//セルの描画

function paint() {

	//黒で背景塗りつぶし
	context.fillStyle = "#ddd";
	//座標（０，０にセル幅・高さ×行・列数＋１０の四角形を描画）
	context.fillRect(0, 300, 300, 300);

	//黒で背景塗りつぶし
	context.fillStyle = "#000";
	//座標（０，０にセル幅・高さ×行・列数＋１０の四角形を描画）
	context.fillRect(0, 0, cellRetsu * cellWidth + 10, cellGyou * cellHeight + 10);

	for (var y = 0; y < cells.length; y++) {
		for (var x = 0; x < cells[y].length; x++) {
			switch (cells[y][x].color) {

				case 5:
					context.fillStyle = "#f0f";

					context.fillText(cells[y][x].color, cells[y][x].x, cells[y][x].y + 330);
					break;

				case 4:
					context.fillStyle = "#0f0";

					context.fillText(cells[y][x].color, cells[y][x].x, cells[y][x].y + 330);
					break;

				case 3:
					context.fillStyle = "#ff0";

					context.fillText(cells[y][x].color, cells[y][x].x, cells[y][x].y + 330);
					break;
				case 1:
					context.fillStyle = "red";

					context.fillText(cells[y][x].color, cells[y][x].x, cells[y][x].y + 330);
					break;
				case 2:
					context.fillStyle = "blue";

					context.fillText(cells[y][x].color, cells[y][x].x, cells[y][x].y + 330);
					break;
				case -1:
					context.fillStyle = "rgba(" + [0, 0, 0, 0] + ")";
					context.fillText(cells[y][x].color, cells[y][x].x, cells[y][x].y + 330);
					break;

			} //switch
			if (y === 0 && cells[y][x].dropF === true) {
				context.fillRect(cells[y][x].x, (y + 1) * 30, cellWidth, 30 - cells[y][x].move);
			}
			if (y != 0) {
				context.fillRect(cells[y][x].x, cells[y][x].y, cellWidth - 1, cellHeight - 1);
			}
		}
	}

} //paint()

/*クリックしたセルの色番号を-1にする//////////
addEventListener("click", (event) => {

	//絶対座標
	var clickX = event.pageX;
	var clickY = event.pageY;


	//クリックされたのがcanvas要素内であるか判定
	if (clickX >= 0 && clickX <= canvas.width && clickY >= 0 && clickY <= canvas.height) {
		//clickCellNo=[行番号、列番号]
		clickCellGyou = Math.floor(clickY / cellHeight);
		clickCellRetsu = Math.floor(clickX / cellWidth);

		console.log("[" + clickCellGyou + "]," + "[" + clickCellRetsu + "]");
		cells[clickCellGyou][clickCellRetsu].color = -1;
		main();

	}

}, false)
*/ /////////////////////////////////////

//マウスが押された時に呼ばれる関数
function mouseDownfunc(event) {
	//絶対座標を取得
	var clickX = event.pageX;
	var clickY = event.pageY;

	//クリックされたのがcanvas要素内であるか判定し、行・列番号を計算する
	if (clickX >= 0 && clickX <= canvas.width && clickY >= 0 && clickY <= canvas.height) {
		//clickCellNo=[行番号、列番号]
		clickCellGyou = Math.floor(clickY / cellHeight);
		clickCellRetsu = Math.floor(clickX / cellWidth);

		//ボタン押下中にマウスが動いたらmouseMoveFuncへ
		addEventListener("mousemove", mouseMoveFunc, false);
	}

	function mouseMoveFunc(event) {

	}

	addEventListener("mousedown", mouseDownFunc, false)


	//1~任意の数までの整数をランダムで返す
	function randomNum(num) {
		return Math.ceil(Math.random() * num);
	}

	//セルの落下判定と落下中のセル座標の計算
	function cellDrop() {
		for (var y = 0; y < cells.length; y++) {
			for (var x = 0; x < cells[y].length; x++) {
				//一番上の行のセルが消えたら、セルに新しい色番号を付与
				if (y === 0) {
					if (cells[y][x].color === -1) {
						cells[y][x].color = randomNum(cellType);
					}
				}
				//セルが落ち終わったら,パラメータをリセットする
				if (cells[y][x].move <= 0) {
					cells[y][x].move = 30;
					cells[y][x].dropF = false;
					cells[y][x].y = y * cellHeight;
					cells[y + 1][x].color = cells[y][x].color;
					cells[y][x].color = -1;
				} else if (cells[y][x].dropF === true) {
					//セルの落下中判定が真のとき
					cells[y][x].y += cells[y][x].moveSpeed;
					cells[y][x].move -= cells[y]
				[x].moveSpeed;
				} else if (y < cells.length - 1) {
					//ひとつしたのセルの色番号が-1か、落下中判定が真のとき、
					if (cells[y + 1][x].color === -1 || cells[y + 1][x].dropF === true) {
						cells[y][x].dropF = true;
						cells[y][x].y += cells[y][x].moveSpeed;

						cells[y][x].move -= cells[y]
					[x].moveSpeed;
					}
				}
			} //forX
		} //forY
	}

	//セルの色決め
	for (var y = 0; y < cellGyou; y++) {

		cells[y] = [];

		for (var x = 0; x < cellRetsu; x++) {
			cells[y][x] = new Cells(x, y);
			cells[y][x].color = randomNum(cellType);
		} //forX
	} //forYセルの色決めおわり
	//cells[2][0].color = -1;


	paint();

	function main() {

		cellDrop()
		paint();
		setTimeout(main, 20)

	} //main()

	main();
