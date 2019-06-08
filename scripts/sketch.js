
//

let bg = {};
let c;
let tokens = [];

let active_token=null;

function reset() {
	localStorage.clear();
	localStorage.session = JSON.stringify(false);
	location.reload();
}

function save() {
	localStorage.session = JSON.stringify(true);
	localStorage.c = CircularJSON.stringify(c["0"]);
	localStorage.bg = JSON.stringify(bg);
	localStorage.tokens = JSON.stringify(tokens);
	localStorage.active_token = JSON.stringify(active_token);
}

function retrieve(){
	bg = JSON.parse(localStorage.bg);

		let unserial = CircularJSON.parse(localStorage.c);
		let ls = unserial[Object.keys(unserial)[0]].jCanvas.layers;

		c[0].width = window.innerWidth - 50;
		c[0].height = window.innerHeight - 50;
		for (let i = 0; i < ls.length; i++) {
			if (ls[i].groups[0] == "tokens" || ls[i].name == "bg") {
				c.addLayer(ls[i]._args);
				c.setLayer(ls[i].name, {
					click: token_clicked,
					dragstart: token_dragged,
				})
				c.setLayer(ls[i].name, {
					data: ls[i].data
				})
				let im = new Image();
				im.style.verticalAlign = "middle";
				im.style.borderRadius = "100%";
				im.style.margin = "5px";
				im.src = ls[i].source;
				im.width = 50;
				im.height = 50;
				$(im).addClass("token");
				$(im).click(im_token_clicked);
				im.name = ls[i].name;
				$("#token_holder").append(im);
			}
		}

		tokens = JSON.parse(localStorage.tokens);
		active_token = JSON.parse(localStorage.active_token);
}

$(document).ready(function () {
	console.log("Document is ready");
	let bool = JSON.parse(localStorage.session);
	bool=false; // Disabling retrieving in dev
	c = $("#myCanvas");
	c.drawArc({
		layer: true,
		name: "active",
		visible: false,
		strokeStyle: '#a30808',
		strokeWidth: 8,
		x: 100,
		y: 100,
		radius: 50
	});
	if (!bool) {
		bg.width = 0;
		bg.height = 0;
		bg.isbg = false;

		c[0].width = window.innerWidth - 50;
		c[0].height = window.innerHeight - 50;

	} else {
		retrieve();
	}

	$("#token_info").val("HP : \nPM : \nPE : \n\n");
	$("#token_info_d").val("");

	c.mousedown(function () {
		token_dragged();
	});

	$("#modify_token_button").addClass("disabled");

	$("#token_info_d").on('input selectionchange propertychange', function () {
		if (active_token != null) {
			if ($("#token_info_d").val() == active_token.data.info) {
				//console.log("hey");
				$("#modify_token_button").addClass("disabled");
			} else {
				$("#modify_token_button").removeClass("disabled");
			}
		}
	});
	$("#token_check").change(function () {
		if ($(this).is(':checked')) {
			c.setLayerGroup('handle', {
				visible: true
			}).drawLayers();
		} else {
			c.setLayerGroup('handle', {
				visible: false
			}).drawLayers();
		}
	});
});

function Token(layer) {
	this.layer = layer;
};

function openNav() {
	document.getElementById("mySidenav").style.width = "350px";
}

function closeNav() {
	document.getElementById("mySidenav").style.width = "0px";
}

$("#token_file_input").change(function () {
	if (this.files && this.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			let data = e.target.result;
			let i = new Image();
			let new_src;
			i.onload = function () {
				var tmpCanvas = document.createElement('canvas');
				let w = i.width;
				let h = i.height;
				if (w < h) {
					min = w;
				} else {
					min = h;
				}
				tmpCanvas.width = min;
				tmpCanvas.height = min;
				tmpCtx = tmpCanvas.getContext('2d');
				tmpCtx.save();
				tmpCtx.beginPath();
				tmpCtx.arc(min / 2, min / 2, min / 2, 0, Math.PI * 2, true);
				tmpCtx.closePath();
				tmpCtx.clip();

				tmpCtx.drawImage(i, 0, 0, min, min);

				tmpCtx.beginPath();
				tmpCtx.arc(0, 0, min / 2, 0, Math.PI * 2, true);
				tmpCtx.clip();
				tmpCtx.closePath();
				tmpCtx.restore();
				new_src = tmpCanvas.toDataURL();
				$("#token")[0].src = new_src;
			};
			i.src = data;
			//$("#token_info").val("HP : \nPM : \nPE : \n\n");
		}
		reader.readAsDataURL(this.files[0]);
	}
});

function create_token() {
	let token_name = $("#token_name").val();
	let ispresent = false;
	for (let i = 0; i < tokens.length; i++) {
		if (token_name == tokens[i]) {
			ispresent = true;
		}
	}
	if (!ispresent) {

		let im = new Image();
		im.style.verticalAlign = "middle";
		im.style.borderRadius = "100%";
		im.style.margin = "5px";
		im.src = $("#token")[0].src;
		im.width = 50;
		im.height = 50;
		$(im).addClass("token");
		$(im).click(im_token_clicked);
		im.name = token_name;

		c.drawImage({
			layer: true,
			draggable: true,
			groups: ["tokens"],
			name: token_name,
			type: 'image',
			source: $("#token")[0].src,
			x: c[0].width / 2,
			y: c[0].height / 2,
			width: 50,
			height: 50,
			strokeWidth: 10,
			strokeStyle: '#c33',
			data: {
				//img: im,
				info: $("#token_info").val()
			},
			click: token_clicked,
			dragstart: token_dragged,
			handle: {
				type: 'rectangle',
				fillStyle: '#c33',
				width: 10,
				height: 10
			},
			resizeFromCenter: false,
			constrainProportions: true,
			cursors: {
				mouseover: 'pointer',
			},
			fromCenter: true,
		}).drawLayers();
		$("#token_holder").append(im);
		tokens.push(token_name);
		$("#token_check").change();
	} else {
		alert("Ce nom de token est déjà pris !");
	}
}

function im_token_clicked() {
	//token_dragged();
	let name = this.name;
	let l = c.getLayer(name);
	token_clicked(l);
}

function token_clicked(layer) {
	active_token = {};
	active_token.name = layer.name;
	active_token.data = layer.data;
	let xp = layer.x;
	let yp = layer.y;
	let r = layer.width / 2;
	c.setLayer("active", {
		x: xp,
		y: yp,
		radius: r,
		visible: true
	}).drawLayers();
	$("img").removeClass("selected_token");
	$("img[name='" + layer.name + "']").addClass("selected_token");
	set_infos(active_token);

}

function token_dragged() {
	active_token = null;
	c.setLayer("active", {
		visible: false
	}).drawLayers();
	$("img").removeClass("selected_token");
	set_infos(active_token);
}

function set_infos(token) {
	if (token == null) {
		$("#token_name_p").html("");
		$("#token_info_d").val("");
	} else {
		$("#token_name_p").html(token.name);
		$("#token_info_d").val(token.data.info);
	}
}

function modify_token() {
	if (active_token != null) {
		c.setLayer(active_token.name, {
			data: {
				//img: active_token.data.img,
				info: $("#token_info_d").val()
			}
		});
	}
	$("#modify_token_button").addClass("disabled");
}

function delete_token() {
	if (active_token != null) {
		if (confirm("Supprimer le token "+active_token.name+" ?")) {
		 c.removeLayer(active_token.name);
		 $("img[name='" + active_token.name + "']").remove();
		 c.setLayer("active",{visible: false});
		 set_infos(null);
		 c.drawLayers();
		for(var i = tokens.length - 1; i >= 0; i--) {
			if(tokens[i] === active_token.name) {
			   tokens.splice(i, 1);
			}
		}
		 active_token = null;
		} else {
		  
		}
	}
	
}

$("#bg_file_input").change(function () {
	if (this.files && this.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			let data = e.target.result;
			let i = new Image();
			i.onload = function () {
				bg.width = i.width;
				bg.height = i.height;
				if (!bg.isbg) {
					c.drawImage({
						layer: true,
						name: "bg",
						type: 'image',
						source: data,
						x: c[0].width / 2,
						y: c[0].height / 2,
						fromCenter: true,
					}).drawLayers();
					bg.isbg = true;
					c.moveLayer('bg', 0)
				} else {
					c.setLayer('bg', {
						source: data
					}).drawLayers();
				}
				auto_bg();
			};
			i.src = data;
		}
		reader.readAsDataURL(this.files[0]);
	}
});

// Scale the bg
function scale_bg() {
	if (bg.isbg) {
		let s = $("#scale").val();
		s = s / 100;
		c.setLayer('bg', {
			width: bg.width * s,
			height: bg.height * s
		}).drawLayers();

		bg.width = bg.width * s;
		bg.height = bg.height * s;
	}
}

function auto_bg() {
	if (bg.isbg) {
		let iw = c[0].width;
		let ih = c[0].height;

		let w = bg.width;
		let h = bg.height;

		let r = iw / w;
		let nh = h * r;
		let nw = w * r;

		if (nh > c[0].height) {
			r = ih / h;
			nh = ih;
			nw = w * r;
		}
		c.setLayer('bg', {
			width: nw,
			height: nh
		}).drawLayers();
		bg.width = bg.width * r;
		bg.height = bg.height * r;
	}
}

$("#scale").on("keydown", function search(e) {
	if (e.keyCode == 13) {
		scale_bg();
	}
});
