(function() {
  var dom, node, val, valide;

  dom = {
    txt_char: $('#text'),
    txt_armn: $('#arm'),
    txt_frec: $('#frec'),
    chk_debg: $('#check'),
    box_debg: $('.debug'),
    ico_load: $('.load'),
    inputs: $('	input'),
    graph: $('#graph'),
    numbers: $('.number'),
    dbg_char: $('#dbg_char'),
    dbg_frec: $('#dbg_frec'),
    dbg_arm: $('#dbg_arm'),
    dbg_a0: $('#dbg_a0'),
    dbg_an: $('#dbg_an'),
    dbg_bn: $('#dbg_bn'),
    dbg_ascii: $('#dbg_ascii'),
    dbg_bin: $('#dbg_bin'),
    dbg_bn: $('#dbg_bn'),
    dbg_w0: $('#dbg_w0'),
    dbg_t: $('#dbg_t')
  };

  val = {
    pi: Math.PI,
    pi_4: Math.PI / 4,
    f: 0,
    w0: 0,
    T: 0
  };

  valide = {
    numeric: function(event) {
      if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || (event.keyCode === 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39) || event.keyCode === 110) {
        return true;
      } else if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
        return event.preventDefault();
      }
    }
  };

  node = {
    init: function() {
      var self;
      self = this;
      dom.numbers.on('keydown', function(event) {
        return valide.numeric(event);
      });
      dom.txt_char.on('keyup', function() {
        return self._change();
      });
      dom.txt_armn.on('keyup', function() {
        return self._change();
      });
      dom.txt_frec.on('keyup', function() {
        return self._change();
      });
      dom.chk_debg.on('click', function() {
        if (dom.chk_debg.is(':checked')) {
          return dom.box_debg.show('slow');
        } else {
          return dom.box_debg.hide('slow');
        }
      });
      dom.inputs.prop('disabled', false);
      dom.ico_load.remove();
      return $('header, div, footer').removeClass('hide');
    },
    _change: function() {
      var a0, armn, ascii, bin, char, frec, self;
      self = this;
      char = dom.txt_char.val();
      armn = dom.txt_armn.val();
      frec = dom.txt_frec.val();
      if (char.length > 0 && armn.length > 0 && frec.length > 0) {
        val.f = frec;
        val.w0 = 2 * val.pi * parseInt(frec);
        val.T = 1 / parseInt(frec * 8);
        ascii = self._toascii(char);
        bin = self._tobin(ascii);
        a0 = self._geta0(bin);
        self._fourier(a0, bin, armn);
        dom.dbg_char.text(char);
        dom.dbg_bin.text(bin);
        dom.dbg_ascii.text(ascii);
        dom.dbg_frec.text(frec);
        dom.dbg_a0.text(a0);
        dom.dbg_arm.text(armn);
        dom.dbg_w0.text(val.w0);
        return dom.dbg_t.text(val.T);
      }
    },
    _toascii: function(char) {
      return char.charCodeAt(0);
    },
    _tobin: function(decimal) {
      var bin;
      bin = parseInt(decimal).toString(2);
      while (bin.length < 8) {
        bin = "0".concat(bin);
      }
      return bin;
    },
    _geta0: function(bin) {
      var a0, i;
      a0 = 0;
      for (i = 0; i <= 7; i++) {
        if (bin[i] === '1') a0 += 1 / 8;
      }
      return a0;
    },
    _getan: function(bin, armn) {
      var an, i, n;
      an = 0;
      n = armn;
      for (i = 0; i <= 7; i++) {
        if (bin[i] === '1') {
          an += Math.sin(n * val.pi_4 * (i + 1)) - Math.sin(n * val.pi_4 * i);
        }
      }
      return an *= 1 / (n * val.pi);
    },
    _getbn: function(bin, armn) {
      var bn, i, n;
      bn = 0;
      n = armn;
      for (i = 0; i <= 7; i++) {
        if (bin[i] === '1') {
          bn += Math.cos(n * val.pi_4 * i) - Math.cos(n * val.pi_4 * (i + 1));
        }
      }
      return bn *= 1 / (n * val.pi);
    },
    _fourier: function(a0, bin, armn) {
      var fn, points, self, x, _ref, _ref2;
      self = this;
      points = [];
      fn = function(t) {
        var f, n;
        f = 0;
        for (n = 1; 1 <= armn ? n <= armn : n >= armn; 1 <= armn ? n++ : n--) {
          f += self._getan(bin, n) * Math.cos(val.w0 * n * t) + self._getbn(bin, n) * Math.sin(val.w0 * n * t);
        }
        return f += a0;
      };
      for (x = 0, _ref = val.T * 8, _ref2 = val.T / 50; 0 <= _ref ? x <= _ref : x >= _ref; x += _ref2) {
        points.push([x, fn(x)]);
      }
      return $.plot(dom.graph, [points]);
    }
  };

  $(function() {
    return node.init();
  });

}).call(this);
