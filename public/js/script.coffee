node = {
	init: ()->
		$('#text').on 'change keydown click', ->
			self = $('#text')
			str = self.val()
			ascii = new Array(str.length)
			bin = new Array(str.length)
			for i in str.length
				ascii[i]=str.charCodeAt(i)
				bin[i]=toBinary(ascii[i])
			console.log(bin)

	toBinary: ()->
		answer = new Array(8);
		for i in answer.length
			answer[i]=0
		x2 = decimal;
		log2 = 0
		while x2 >= 2
				x2 = x2 / 2
				log2 = log2 + 1
		for l2 in [log2..0]
				power = Math.pow(2, l2)
				if decimal >= power
						answer[l2] = 1
						decimal -= power
				else
					answer[l2] = 0
		answer.reverse()
}

$->
	node.init()