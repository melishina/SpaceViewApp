//gets todays date and calls on the draw function
function initLunarPhase() {
	var $date = new Date();
	var $year = $date.getFullYear();
	var $month = $date.getMonth() + 1;
	var $day = $date.getDate();

	document.getElementById('day').innerHTML = $day;
	if ($month < 10) {
		document.getElementById('month').innerHTML = '0' + $month;
	} else {
		document.getElementById('month').innerHTML = $month;
	}
	document.getElementById('year').innerHTML = $year;

	var $moonPhase = moonPhase($year, $month, $day);
	drawMoon($moonPhase - 1);
}

//function that calculates the moon phase given a certain day
function moonPhase(year, month, day) {
	n = Math.floor(12.37 * (year - 2020 + (1.0 * month - 0.5) / 12.0));
	RAD = 3.14159265 / 180.0;
	t = n / 1236.85;
	t2 = t * t;
	as = 359.2242 + 29.105356 * n;
	am = 306.0253 + 385.816918 * n + 0.01073 * t2;
	xtra = 0.75933 + 1.53058868 * n + (1.178e-4 - 1.55e-7 * t) * t2;
	xtra +=
		(0.1734 - 3.93e-4 * t) * Math.sin(RAD * as) - 0.4068 * Math.sin(RAD * am);
	i = xtra > 0.0 ? Math.floor(xtra) : Math.ceil(xtra - 1.0);
	j1 = julday(year, month, day);
	jd = 2415020 + 28 * n + i;
	return (j1 - jd + 30) % 30;
}

//function that calculates julian date
function julday(year, month, day) {
	if (year < 0) {
		year++;
	}
	var jy = parseInt(year);
	var jm = parseInt(month) + 1;
	if (month <= 2) {
		jy--;
		jm += 12;
	}
	var jul =
		Math.floor(365.25 * jy) +
		Math.floor(30.6001 * jm) +
		parseInt(day) +
		1720995;
	if (day + 31 * (month + 12 * year) >= 15 + 31 * (10 + 12 * 1582)) {
		ja = Math.floor(0.01 * jy);
		jul = jul + 2 - ja + Math.floor(0.25 * ja);
	}
	return jul;
}

//draws the lunar phase
function drawMoon($moonPhase) {
	var $moonCanvas = document.getElementById('moonCanvas');
	var $ctx = $moonCanvas.getContext('2d');

	//draw half moon
	var $radius = $moonCanvas.width / 2;
	var $centerX = $moonCanvas.width / 2;
	var $centerY = $moonCanvas.height / 2;
	var $moonFill = $ctx.createRadialGradient(
		$centerX,
		$centerY,
		$radius,
		$centerX,
		$centerY,
		$moonCanvas.width / 2
	);
	$moonFill.addColorStop(0, '#313132');
	$moonFill.addColorStop(1, 'white');

	$ctx.beginPath();
	$ctx.arc(
		$centerX,
		$centerY,
		$radius,
		270 * (Math.PI / 180),
		90 * (Math.PI / 180),
		$moonPhase < 15 ? false : true
	);
	$ctx.fillStyle = $moonFill;
	$ctx.fill();

	var $ovalWidth = -$moonCanvas.width;
	$ovalWidth = $moonPhase < 15
		? -$moonCanvas.width + $moonPhase * 28.5
		: $moonCanvas.width - ($moonPhase - 15) * 28.5;
	var $ovalColor = $ovalWidth > 0 ? $moonFill : '#313132';

	drawEllipse(
		$ctx,
		$centerX - $ovalWidth / 2,
		0,
		$ovalWidth,
		$moonCanvas.width,
		$ovalColor
	);
	function drawEllipse(ctx, x, y, w, h, fill) {
		var kappa = 0.5522848;
		(ox = w / 2 * kappa), (oy = h / 2 * kappa), (xe = x + w), (ye = // control point offset horizontal // control point offset vertical // x-end
			y + h), (xm = x + w / 2), (ym = y + h / 2); // y-end // x-middle // y-middle

		ctx.beginPath();
		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		ctx.fillStyle = $ovalColor;
		ctx.fill();
	}
}

initLunarPhase();
