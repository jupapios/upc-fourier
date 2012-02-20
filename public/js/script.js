var node = {
	init: function () {
		$('#text').on('keyup keydown', function () { node._onChange($('#text'), $('#len'), $('#data')); });
		$('.number').on('keydown', function (event) { valide.numeric(event) });
		$('#check').on('click', function () {
			if ($('#check:checked').length) $('.debug').show('slow');
			else $('.debug').hide('slow');
		});
	},
	_onChange: function (self, len, data) {
		var str = self.val();
		var ascii = new Array(str.length);
		var bin = new Array(str.length);
		var r = new Array(), j = -1;
		len.text(str.length);
		$.each(str, function (i, val) {
			ascii[i] = str.charCodeAt(i);
			bin[i] = node._toBinary(ascii[i]);
			r[++j] ='<tr><td>';
			r[++j] = val;
			r[++j] = '</td><td>';
			r[++j] = ascii[i];
			r[++j] = '</td><td>';
			r[++j] = bin[i].toString().split(',').join('');
			r[++j] = '</td><td>';
			r[++j] = 'a0';
			r[++j] = '</td><td>';
			r[++j] = 'an';
			r[++j] = '</td><td>';
			r[++j] = 'bn';
			r[++j] = '</td></tr>';
			data.html(r.join('')); 
		});
		if (str.length === 0) data.html(''); 
		//console.log(bin);
	}, 
	_toBinary: function (decimal) {
		answer = new Array(8);
		for (var i = 0; i < answer.length; i++) answer[i] = 0;
		x2 = decimal;
		log2 = 0;
		while (x2 >= 2) {
			x2 = x2 / 2;
			log2 = log2 + 1;
		}
		for (l2 = log2; l2 >= 0; l2--) {
			power = Math.pow(2, l2);
			if (decimal >= power) {
				answer[l2] = 1;
				decimal -= power;
			} else answer[l2] = 0;
		}
		return answer.reverse();
	}
}
var valide = {
	numeric: function (event) {
		if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || (event.keyCode == 65 && event.ctrlKey === true) ||
		(event.keyCode >= 35 && event.keyCode <= 39)) return;
		else if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) event.preventDefault();
	}
}

$(function () {
	node.init();
});