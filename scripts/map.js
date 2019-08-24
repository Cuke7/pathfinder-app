//

let bg = {};
let c;
let tokens = [];

let active_token = null;

let drag_flag = false;

let bg_locked = false;

$(document).ready(function() {
    console.log("Document is ready");
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
    bg.width = 0;
    bg.height = 0;
    bg.isbg = false;


    c[0].width = window.innerWidth - 80 - 90;
    c[0].height = window.innerHeight - 150;

    $("#token_info").val("HP : \nPM : \nPE : \n\n");
    $("#token_info_d").val("");

    c.mousedown(function(e) {
        c.setLayer("active", {
            visible: false
        }).drawLayers();
        $("img").removeClass("selected_token");
        set_infos(active_token);
        closeInfoDiv();
        closeNav();
    });

    c.mouseup(function(e) {
        c.setLayerGroup('handle', {
            visible: false
        }).drawLayers();
        if (!bg_locked) {
            c.setLayer('bg', {
                handle: {
                    type: 'rectangle',
                    fillStyle: '#c33',
                    width: 15,
                    height: 15,
                    visible: true,
                }
            }).drawLayers();
        }
    });

    $("#modify_token_button").addClass("disabled");

    $("#token_info_d").on('input selectionchange propertychange', function() {
        if (active_token != null) {
            if ($("#token_info_d").val() == active_token.data.info) {
                $("#modify_token_button").addClass("disabled");
            } else {
                $("#modify_token_button").removeClass("disabled");
            }
        }
    });
    $("#token_check").change(function() {
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
    $("#bg_check").change(function() {
        if ($(this).is(':checked')) {
            c.setLayer('bg', {
                draggable: false
            }).drawLayers();
            c.setLayer('bg', {
                handle: {
                    visible: false,
                }
            }).drawLayers();
            bg_locked = true;
        } else {
            c.setLayer('bg', {
                draggable: true
            }).drawLayers();
            c.setLayer('bg', {
                handle: {
                    type: 'rectangle',
                    fillStyle: '#c33',
                    width: 15,
                    height: 15,
                    visible: true,
                }
            }).drawLayers();
            bg_locked = false;
        }
    });

    let names = ["louis", "toto", "micka", "flo", "kiki"];
    for (let i = 0; i < names.length; i++) {
        create_token_sratch(names[i], "Notes : \n", "assets/" + names[i] + ".jpg");
    }
    document.getElementById("token_info_div").style.display = "none";
});

function create_token_sratch(name, data, src) {
    let im = new Image();
    im.onload = function() {
        var tmpCanvas = document.createElement('canvas');
        let w = im.width;
        let h = im.height;
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

        tmpCtx.drawImage(im, 0, 0, min, min);

        tmpCtx.beginPath();
        tmpCtx.arc(0, 0, min / 2, 0, Math.PI * 2, true);
        tmpCtx.clip();
        tmpCtx.closePath();
        tmpCtx.restore();
        let new_src = tmpCanvas.toDataURL();
        $("#token")[0].src = new_src;
        $("#token_name").val(name);
        $("#token_info").val(data);
        create_token(100, false);
    };
    im.src = src;
}

$("#token_file_input").change(function() {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            let data = e.target.result;
            let i = new Image();
            let new_src;
            i.onload = function() {
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

function create_token(size, visible) {
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
            width: size,
            height: size,
            strokeWidth: 10,
            strokeStyle: '#c33',
            data: {
                //img: im,
                info: $("#token_info").val()
            },
            click: token_clicked,
            dragstart: token_dragged,
            dblclick: token_dbclicked,
            handle: {
                type: 'rectangle',
                fillStyle: '#c33',
                width: 10,
                height: 10,
                visible: visible
            },
            resizeFromCenter: false,
            constrainProportions: true,
            cursors: {
                mouseover: 'pointer',
            },
            fromCenter: true,
            bringToFront: true,
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
    openInfoDiv(l.x, l.y);
}

function token_dbclicked(layer) {
    openInfoDiv(layer.x, layer.y);
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
    c.setLayer(layer.name, {
        handle: {
            type: 'rectangle',
            fillStyle: '#c33',
            width: 10,
            height: 10,
            visible: true
        }
    }).drawLayers();
    if (drag_flag) {
        active_token = null;
        c.setLayer("active", {
            visible: false
        }).drawLayers();
        $("img").removeClass("selected_token");
        set_infos(active_token);
        c.setLayer(layer.name, {
            handle: {
                visible: false
            }
        }).drawLayers();
        drag_flag = false;
    }
}

function token_dragged() {
    active_token = null;
    c.setLayer("active", {
        visible: false
    }).drawLayers();
    $("img").removeClass("selected_token");
    set_infos(active_token);
    drag_flag = true;
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
        if (confirm("Supprimer le token " + active_token.name + " ?")) {
            c.removeLayer(active_token.name);
            $("img[name='" + active_token.name + "']").remove();
            c.setLayer("active", {
                visible: false
            });
            set_infos(null);
            c.drawLayers();
            for (var i = tokens.length - 1; i >= 0; i--) {
                if (tokens[i] === active_token.name) {
                    tokens.splice(i, 1);
                }
            }
            active_token = null;
        } else {}
    }
    token_dragged();
}

$("#bg_file_input").change(function() {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            let data = e.target.result;
            let i = new Image();
            i.onload = function() {
                bg.width = i.width;
                bg.height = i.height;
                if (!bg.isbg) {
                    c.drawImage({
                        layer: true,
                        name: "bg",
                        type: 'image',
                        source: data,
                        draggable: true,
                        x: c[0].width / 2,
                        y: c[0].height / 2,
                        fromCenter: true,
                        handle: {
                            type: 'rectangle',
                            fillStyle: '#c33',
                            width: 15,
                            height: 15,
                            visible: true,
                        },
                        resizeFromCenter: false,
                        constrainProportions: false,
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
            height: nh,
            x: c[0].width / 2,
            y: c[0].height / 2
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

function openNav() {
    document.getElementById("mySidenav").style.width = "350px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
}

function openInfoDiv(x, y) {
    document.getElementById("token_info_div").style.display = "block";
    if (x > c[0].width / 2) {
        document.getElementById("token_info_div").style.right = c[0].width - x + 'px';
        document.getElementById("token_info_div").style.left = 'auto';
    } else {
        document.getElementById("token_info_div").style.left = x + 90 + 'px';
        document.getElementById("token_info_div").style.right = 'auto';
    }

    if (y > c[0].height / 2) {
        document.getElementById("token_info_div").style.bottom = c[0].height - y + 'px';
        document.getElementById("token_info_div").style.top = 'auto';
    } else {
        document.getElementById("token_info_div").style.top = y + 15 + 'px';
        document.getElementById("token_info_div").style.bottom = 'auto';
    }
}

function closeInfoDiv() {
    document.getElementById("token_info_div").style.display = "none";
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
