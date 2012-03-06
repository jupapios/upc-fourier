
# namespace for static values
dom = {

	# dom objects
	txt_char: $ '#text'
	txt_armn: $ '#arm'
	txt_frec: $ '#frec'
	txt_amp: $ '#amp'	
	chk_debg: $ '#check'
	box_debg: $ '.debug'
	ico_load: $ '.load'
	inputs: $ '	input'
	graph: $ '#graph'
	numbers: $ '.number'
	#debug fields
	dbg_char: $ '#dbg_char'
	dbg_frec: $ '#dbg_frec'
	dbg_arm: $ '#dbg_arm'
	dbg_a0: $ '#dbg_a0'
	dbg_an: $ '#dbg_an'
	dbg_bn: $ '#dbg_bn'
	dbg_ascii: $ '#dbg_ascii'
	dbg_bin: $ '#dbg_bin'
	dbg_bn: $ '#dbg_bn'
	dbg_w0: $ '#dbg_w0'
	dbg_t: $ '#dbg_t'	
}

# values
val = {
	pi: Math.PI
	pi_4: Math.PI/4
	f: 0
	w0: 0
	T: 0
	amp: 0
}

# valide functions
valide = {
	numeric: (event)->
		if event.keyCode is 46 or event.keyCode is 8 or event.keyCode is 9 or event.keyCode is 27 or (event.keyCode is 65 and event.ctrlKey is true) or (event.keyCode >= 35 and event.keyCode <= 39) or event.keyCode is 110
			return true
		else if (event.keyCode < 48 or event.keyCode > 57) and (event.keyCode < 96 or event.keyCode > 105)
			event.preventDefault()
}

# namespace
node = {

	# init function
	init: ()->
		self = this
		dom.numbers.on 'keydown', (event)->
			valide.numeric event
		dom.txt_char.on 'keyup', ()->
			self._change()
		dom.txt_armn.on 'keyup', ()->
			self._change()
		dom.txt_frec.on 'keyup', ()->
			self._change()
		dom.txt_amp.on 'keyup', ()->
			self._change()
		dom.chk_debg.on 'click', ()->
			if dom.chk_debg.is ':checked'
				dom.box_debg.show 'slow'
			else
				dom.box_debg.hide 'slow'

		# enable all fields (inputs)
		dom.inputs.prop 'disabled', false
		dom.ico_load.remove()
		$('header, div, footer').removeClass 'hide'

	# change for text, here is the magic :)
	_change: ()->
		self = this
		char = dom.txt_char.val()
		armn = dom.txt_armn.val()
		frec = dom.txt_frec.val()
		amp = dom.txt_amp.val()
		if char.length > 0 and armn.length > 0 and frec.length > 0 and amp.length > 0
			val.f = frec
			val.w0 = 2 * val.pi * parseInt frec
			val.T = 1 / parseInt frec * 8
			val.amp = parseInt amp
			ascii = self._toascii char
			bin = self._tobin ascii
			a0 = self._geta0 bin
			self._fourier a0, bin, armn
			dom.dbg_char.text char
			dom.dbg_bin.text bin
			dom.dbg_ascii.text ascii
			dom.dbg_frec.text frec
			dom.dbg_a0.text a0
			dom.dbg_arm.text armn
			dom.dbg_w0.text val.w0
			dom.dbg_t.text val.T

	# converts character value to ascii
	_toascii: (char)->
		char.charCodeAt(0)

	# converts decimal value to binary
	_tobin: (decimal)->
		bin = parseInt(decimal).toString 2
		while bin.length < 8
			bin = "0".concat bin
		bin
	
	# returns a0 (fourier)
	_geta0: (bin)->
		a0 = 0
		for i in [0..7]
			if bin[i] == '1'
				a0 += val.amp/8
		a0

	# returns an (fourier)
	_getan: (bin, armn)->
		an = 0
		n = armn
		for i in [0..7]
			if bin[i] == '1'
				an += ( Math.sin( n*val.pi_4*(i+1) ) - Math.sin( n*val.pi_4*i) )
		an *= (1 / (n * val.pi))
		
	# returns bn (fourier)
	_getbn: (bin, armn)->
		bn = 0
		n = armn
		for i in [0..7]
			if bin[i] == '1'
				bn += ( Math.cos( n*val.pi_4*i ) - Math.cos( n*val.pi_4*(i+1) ) )
		bn *= (1 / (n * val.pi))

	# calcule fourier serie
	_fourier: (a0, bin, armn)->
		self = this
		points = []
		fn = (t)->
			f = 0
			for n in [1..armn]
				f += self._getan(bin, n)*Math.cos(val.w0*n*t) + self._getbn(bin, n)*Math.sin(val.w0*n*t)
			f += a0
		# values for plot
		for x in [0..val.T*8] by val.T/50
			points.push([x, fn(x)])
		$.plot(dom.graph, [points])
}

$ ()->
	node.init()