"use strict";

function dice_initialize(container) {
	
	$t.remove($t.id('loading_text'));

    var canvas = $t.id('canvas');
    canvas.style.width = window.innerWidth - 50 + 'px';
    canvas.style.height = window.innerHeight - 50 + 'px';
    var label = $t.id('label');
    var set = $t.id('set');
    var selector_div = $t.id('selector_div');
    var info_div = $t.id('info_div');
    on_set_change();

    $t.dice.use_true_random = false;

    function on_set_change(ev) { set.style.width = set.value.length + 3 + 'ex'; }
    $t.bind(set, 'keyup', on_set_change);
    $t.bind(set, 'mousedown', function(ev) { ev.stopPropagation(); });
    $t.bind(set, 'mouseup', function(ev) { ev.stopPropagation(); });
    $t.bind(set, 'focus', function(ev) { $t.set(container, { class: '' }); });
    $t.bind(set, 'blur', function(ev) { $t.set(container, { class: 'noselect' }); });

    $t.bind($t.id('clear'), ['mouseup', 'touchend'], function(ev) {
        ev.stopPropagation();
        set.value = '0';
        on_set_change();
    });

    var box = new $t.dice.dice_box(canvas, { w: 500, h: 300 });
    box.animate_selector = false;

    $t.bind(window, 'resize', function() {
        canvas.style.width = window.innerWidth - 50 + 'px';
        canvas.style.height = window.innerHeight - 50 + 'px';
        box.reinit(canvas, { w: 500, h: 300 });
    });

    function show_selector() {
        info_div.style.display = 'none';
        selector_div.style.display = 'none'; // inline-block
        //box.draw_selector();
    }

    function before_roll(vectors, notation, callback) {
        info_div.style.display = 'none';
        selector_div.style.display = 'none';
        // do here rpc call or whatever to get your own result of throw.
        // then callback with array of your result, example:
        // callback([2, 2, 2, 2]); // for 4d6 where all dice values are 2.
        callback(preset);
    }

    function notation_getter() {
        return $t.dice.parse_notation(set.value);
    }

    function after_roll(notation, result) {
        var res = result.join(' ');
        if (notation.constant) res += ' +' + notation.constant;
        if (result.length > 1) res += ' = ' + 
                (result.reduce(function(s, a) { return s + a; }) + notation.constant);
        label.innerHTML = res;
		if(d=="100"){
			console.log(res[0]+res[2]);
		}else{
			console.log(res);
		}
        info_div.style.display = 'none'; //inline-block
		setTimeout(function (){
		 $("#canvas").css("display", "none");

		}, 5000);
    }

    //box.bind_mouse(container, notation_getter, before_roll, after_roll);
    box.bind_throw($t.id('throw'), notation_getter, before_roll, after_roll);

    $t.bind(container, ['mouseup'], function(ev) {
        ev.stopPropagation();
        if (selector_div.style.display == 'none') {
            if (!box.rolling) show_selector();
            box.rolling = false;
            return;
        }
        var name = box.search_dice_by_mouse(ev);
        if (name != undefined) {
            var notation = $t.dice.parse_notation(set.value);
            notation.set.push(name);
            set.value = $t.dice.stringify_notation(notation);
            on_set_change();
        }
    });

    var params = $t.get_url_params();
    if (params.notation) {
        set.value = params.notation;
		set.value = "3d8";
    }
    if (params.roll) {
        $t.raise_event($t.id('throw'), 'mouseup');
    }
    else {
        //show_selector();
    }
}

let preset;
let d;

function roll_100(val){
	$("#canvas").css("display", "block");
	set.value = "d100+d10";
	preset = [(val-val%10)/10 ,val%10];
	$t.raise_event($t.id('throw'), 'mouseup');
	d = "100";
};

function roll(dic, val){
	$("#canvas").css("display", "block");
	set.value = dic;
	preset = val;
	$t.raise_event($t.id('throw'), 'mouseup');
	d = "other";
}






