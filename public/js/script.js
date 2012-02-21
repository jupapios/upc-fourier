var node = {
	text: $('#text'),
	arm: $('#arm'),
	frec: $('#frec'),
	init: function () {
		var self=this;
		self.text.on('keyup keydown', function () { node._onChange(self.text, $('#len'), $('#data')); });
		$('.number').on('keydown', function (event) { valide.numeric(event) });
		$('#check').on('click', function () {
			if ($('#check:checked').length) $('.debug').show('slow');
			else $('.debug').hide('slow');
		});
		self.arm.on('keyup keydown change', function () { 
			$('.arm').text(self.arm.val());
			node._graph();
		});
		self.frec.on('keyup keydown change', function () { 
			node._graph();
		});

		//Enable all fields (inputs)
		$('input').prop('disabled', false);

		$('.load').remove();
		$('header, div, footer').removeClass('hide');

		//test graph
		node._graph();
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
		node._graph();
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
	},
	_graph: function () {
		var self=this;
		var d1 = [];
		var fn = function (t) {
			var ans = 0;
			return ans + self.frec.val()*sum(self.arm.val(), t);
		}

		var sum = function (n, t) {
			var ans = 0;
			for (var i=1; i<=n*2; i+=2)	ans += (1/i)*Math.sin(i*t);
			return ans;
		}
		if(self.arm.val().length > 0 && self.frec.val().length > 0) for (var t = 0; t < self.text.val().length*(8*Math.PI); t += 0.015) d1.push([t, fn(t)]);
		var graph = $("#graph");
		var plot = $.plot(graph, [d1]);	
	}
}
var valide = {
	numeric: function (event) {
		if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || (event.keyCode == 65 && event.ctrlKey === true) ||
		(event.keyCode >= 35 && event.keyCode <= 39) || event.keyCode == 110) return;
		else if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) event.preventDefault();
	}
}

$(function () {
	node.init();
});