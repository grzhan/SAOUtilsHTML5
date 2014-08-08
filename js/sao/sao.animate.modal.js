// Global Variables
var aStartPosX = 0;
var aStartPosY = 0;
var iconWidth = 64;

// SAOMainItem : SAO Main Menu Items Class
var SAOMainItem = {
	_new : function(name) {
		var item  = {};
		var name_ = name;
		var classTpl = 'icon_';
		var idTpl = 'item_';
		var class_ = classTpl + name;
		var id =  idTpl + name;
		var wid = 'sao_menu_btn_' + name;
		var image_bg_normal = 'resources/images/btn_normal.png';
		var image_bg_hover  = 'resources/images/btn_press.png';
		var image_icon_normal = 'resources/images/'+ name +'_normal.png';
		var image_icon_hover = 'resources/images/' + name +'_hover.png';
		var dom = $('<div class="menu_btn icon_box" id="sao_menu_btn_'+ name +'">\
						<div id="'+ id + '" class="'+ class_ + ' icon_inner">\
						</div>\
					</div>');

		var panel_title = '';
		var panel_image = '';
		var panel_desc = '';

		var posX = 0;
		var posY = 0;

		item.setPanelTitle = function(title) { panel_title = title;};
		item.setPanelDesc = function(desc) { panel_desc = desc;};
		item.setPanelImage = function(image){ panel_image = image;};
		
		item.setPosX = function(value) { posX = value;};
		item.setPosY = function(value) { posY = value;};

		item.getDOM = function(){return dom;};
		item.getName = function(){ return name_;};
		item.getClass = function() { return class_;};
		item.getID = function(){ return id;};
		item.getWID = function() { return wid;};
		item.getPosX = function() { return posX;};
		item.getPosY = function() { return posY;};

		item.setSelected = function() {
			$('#' + wid).css('background-image',"url('" + image_bg_hover + "')");
			$('.'+class_).css('background', "url('"+ image_icon_hover +"') no-repeat");
			$('.'+class_).css('background-position','8px 8px');
		};

		item.cancelSelected = function() {
			$('#' + wid).css('background-image',"url('" + image_bg_normal + "')");
			$('.'+class_).css('background', "url('"+ image_icon_normal +"') no-repeat");
			$('.'+class_).css('background-position','8px 8px');
		};
		return item;
	}
}

// SAO Main Menu Panel Class
var SAOMainPanel = {
	_new : function() {
		var panel = {};

		var id = "sao_menu_panel";
		var sid = "sao_menu_sub_panel";
		var tid = 'panel_title';
		var hid = 'panel_hori';
		var mid = 'panel_main';
		var did = 'panel_desc';
		var baid = 'panel_bottom_arrowhead';
		var raid = 'panel_right_arrowhead';

		var pStartPosX = -252;
		var pStartPosY = -177;

		panel.getDOM = function () {
			var dom = $('<div id="'+ id + '">\
							<div id="'+ tid +'"></div>\
							<div id="'+ hid +'"></div>\
							<div id="'+ mid +'">\
								<div id="' + raid + '"></div>\
							</div>\
							<div id="'+ did + '">\
								<div id="' + baid + '"></div>\
							</div>\
						</div>');
			return dom ;
		};

		panel.setPosX = function(value) { posX = value;};
		panel.setPosY = function(value) { posY = value;};

		panel.getID = function() { return '#' + id;};
		panel.getPosX = function() { return posX;};
		panel.getPosY = function() { return posY;};
		panel.getWidth = function() { return $('#' + id).css('width'); };
		panel.moveTo = function(targetItem,menuPos) {
			console.log('Panel Moving to ' + targetItem.getID());
			$('#' + id).velocity({'top' : pStartPosY + targetItem.getPosY()}, {duration : 200});
		};

		panel.fadeIn = function(targetItem,menuPos) {
			// $(id).fadeIn();
			var pwidth = panel.getWidth();
			console.log('Panel Width: ' + pwidth);
			var dheight = $('#' + did).css('height');
			var baheight  = $('#' + baid).css('height');
			$('#'+ did).css({'height':0});
			$('#'+ baid).css('height' ,0);

			$('#' + id).css({
				'top':pStartPosY + targetItem.getPosY(),
				'left':pStartPosX + parseInt(pwidth) , 
				'width' : 0
			}).velocity({
				opacity : 1, 
				width : pwidth,
				left: pStartPosX
			},{
				display:'block',
				begin : function() {
					$('#' + raid).css('left',0).velocity({ left : pwidth });
				},
				complete : function() {
					$('#' + baid).velocity({height: baheight}, {duration : 100});
					$('#' + did).css({height:0}).velocity({height: dheight});
				}
			});
			console.log('Panel Fading In '+ targetItem.getID() + ':' + targetItem.getPosY() + ' !');
			console.log('Start Pos : {x:' + menuPos.x + ',y:' + menuPos.y + '}');
		};

		panel.fadeOut = function() {
			// $(id).fadeIn();
			$('#' + id).velocity({
				top : '-=50',
				opacity : 0
			}, {
				display : 'none',
				duration: 300
			});
			console.log('Panel Fading Out !');
		};
		return panel;
	}
};

// SAOMainMenu : SAO Main Menu Class
var SAOMainMenu = {
	_new : function() {
		var menu = {};
		var panel = {};
		var items = [];
		var indexItem = {};
		var _startPosX = 0;
		var _startPosY = 0;
		var _menu_name = '#sao_menu';
		var _mask_name = '.sao_mask';
		var _overlay_name = '#sao_overlay';
		var _panel_name = '';
		var selected = -1;
		var mStartPosX = 0;
		var mStartPosY = 0;

		menu.getPos = function() { this.updateStartPos(); return {x : mStartPosX, y: mStartPosY}; };
		menu.getMenuName = function() { return _menu_name;};
		menu.getMaskName = function() { return _mask_name;};
		menu.getOverlayName = function() { return _overlay_name;};
		
		menu.updateStartPos = function() {
			mStartPosX = dStartPosX - (iconWidth / 2);
			mStartPosY = dStartPosY - iconWidth;
			// TODO : refact
			mStartPosY = (mStartPosY < 120) ? 120 : mStartPosY;
			mStartPosY = (mStartPosY > 220) ? 220 : mStartPosY;
			mStartPosX = (mStartPosX < 260) ? 260 : mStartPosX;
			//  mStartPosX ...
		};
		
		menu.createMenu = function() {
			var dom = $('<div id="sao_overlay">\
						   <div class="sao_mask">\
						   </div>\
						   <div id="sao_menu">\
						   </div>\
						</div>');
		};

		menu.createPanel = function() {
			panel = SAOMainPanel._new();
			_panel_name = panel.getID();
			var panel_dom = panel.getDOM();
			$(_menu_name).prepend(panel_dom);
			$(_panel_name).hide();
		};

		menu.createItem = function(name) {
			var item = SAOMainItem._new(name);
			var item_dom = item.getDOM();
			var flag = true;
			for (var i=0; i< items.length;i++) {
				if (items[i].getID() === item.getID()) {
					flag = false;
					break;
				}
			}
			if (!flag) return;
			items.push(item);
			var item_id = item.getWID();
			indexItem[item_id] = items.length - 1;
			$(_menu_name).append(item_dom);
			item_dom.click(function(){
				var item_id = $(this).attr('id');
				if (selected !== indexItem[item_id]) {
					menu.selectItem(indexItem[item_id]);
					var panel_dom = $(panel.getID());
					var menuPos = menu.getPos();
					if (panel_dom.css('display') === undefined ||
					  panel_dom.css('display') === 'none') {
						panel.fadeIn(items[indexItem[item_id]], menuPos);
					} else {
						panel.moveTo(items[indexItem[item_id]], menuPos);
					}
				} else {
					selected = -1;
					items[indexItem[item_id]].cancelSelected();
					panel.fadeOut();
				}
				sao_sound_effects_play('fadeOut');
				sao_sound_effects_play('press');
			});

			item_dom.bind('mouseover', function() {
				var item_id = $(this).attr('id');
				if (indexItem[item_id] !== selected) { items[indexItem[item_id]].setSelected();}
			});

			item_dom.bind('mouseout', function() {
				var item_id = $(this).attr('id');
				if (indexItem[item_id] !== selected) { items[indexItem[item_id]].cancelSelected();}
			});

		};

		menu.selectItem = function(index) {
			if (selected >= 0) {
				items[selected].cancelSelected();
			}
			selected = index;
			items[selected].setSelected();
		}

		menu.toggle = function() {
			menu.updateStartPos();
			var overlay_dom = $(_overlay_name);
			var mask_dom = $(_mask_name);
			if (overlay_dom.css('display') === undefined
				|| overlay_dom.css('display') === 'none') {
				menu.fadeIn();
			} else {
				menu.fadeOut();
			}
		};

		menu.fadeIn = function() {
			var menu_dom = $(_menu_name);
			menu_dom.css('left',mStartPosX);
			menu_dom.css('top',mStartPosY - 100);
			menu_items = $('.menu_btn');
			menu_items.css('top',0);
			menu_items.css('left',0);

			var overlay_dom = $(_overlay_name);
			// overlay_dom.fadeIn('fast');

			var len = items.length;
			overlay_dom.velocity('fadeIn', {duration: 200, begin : function() {
				for (var i=0; i<items.length;i++) {
					var wid = items[i].getWID();
					var endY = (i+1) * 65 + 100;
					// move('#' + wid).delay(0.05*(len-i-1) +'s').duration('0.4s').y(endY).end();
					// $('#' + wid).velocity({opacity : 0});
					$('#' + wid).velocity({
						opacity: 1,
						top : endY
					},{
						delay : 100 * (len-i-1),
						duration: 400,
						display: 'block'
					});
					items[i].setPosY(endY);
				}	
			}});
			$(_mask_name).bind('click',menu.toggle);
			sao_sound_effects_play('fadeIn');
		};


		menu.fadeOut = function() {
			var overlay_dom = $(_overlay_name);
			overlay_dom.velocity('fadeOut', {duration : 400});
			for (var i=0; i<items.length; i++) {
				var wid = items[i].getWID();
				$('#' + wid).velocity({
					top : 0,
					opacity : 0
				},{
					delay : 50 * i,
					duration : 200
				});
				// move('#'+ wid).delay(0.05*i+'s').duration('0.4s').y(0).end();
			}
			panel.fadeOut();
			sao_sound_effects_play('fadeOut');
			if (selected >= 0) { items[selected].cancelSelected(); selected = -1;}
			$(_mask_name).unbind('click');
		};

		return menu;
	}
}



var Menu = SAOMainMenu._new();
Menu.createPanel();
Menu.createItem('info');
Menu.createItem('setting');
Menu.createItem('plugin');


// SAO Util Functions
var audioEffects = new Array();
audioEffects['fadeIn'] = new Audio('resources/sounds/fadeIn.wav');
audioEffects['fadeOut'] = new Audio('resources/sounds/fadeOut.wav');
audioEffects['press'] = new Audio('resources/sounds/press.wav');
function sao_sound_effects_play(n) {
	audioEffects[n].currentTime = 0;
	audioEffects[n].play();
}

function sao_error_alert() {

}