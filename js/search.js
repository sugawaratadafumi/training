/**
 * search.js
 *
 * @date 2013.12.08
 */
 
$(function(){
	compareBox.init();
})


var compareBox = {
	
	container: null,
	listTable: null,
	list: [],
	list_ids: [],
	
	init: function () {
		var self = this;
		self.container = $('#compare_box');
		self.listTable = $('#search_table');
				
		self.container.on("click", "#btn_compare a", function () {
			//console.log('比較');
			self.compare();
		}).on("click", "#btn_clear_all a", function () {
			self.clear();
			//console.log('クリア');
		}).on("click", ".compare_item_remove", function () {
			self.remove($(this).closest(".compare_item").attr("id").split('compare_item_pid_')[1]);
			//console.log('解除');
		});
				
		self.listTable.on("click", ".btn_add", function () {
			var dataRow = $(this).parents('tr');
			var pname = dataRow.find('.product_name');
			var pid = dataRow.attr('id').split('pid_')[1];
			var name = pname.find('p').text();
			var url = pname.find('a').eq(0).attr('href');
			var imgSrc = pname.find('img').eq(0).attr('src');
			//console.log('追加' + pid +','+ name +','+ url +','+ imgSrc );
			
			self.add( pid, name, url, imgSrc );
			$(this).removeClass('btn_add').addClass('btn_remove').text('解除')
			
		}).on("click", ".btn_remove", function () {
			var dataRow = $(this).parents('tr');
			var pid = dataRow.attr('id').split('pid_')[1];
			
			self.remove(pid);
			//console.log(pid);
		});
	},
	
	add: function (pid, name, url, imgSrc) {
		var self = this,
			itemSrc,
			container = self.container,
			list = self.list;
			
		if (-1 === self.list_ids.indexOf(pid) && 5 > list.length){
			list.push([pid, name, url, imgSrc]);
			self.list_ids.push(pid);
			
			itemSrc = [
				'<div class="compare_item" id="compare_item_pid_' + pid + '">',
				'<div class="compare_item_info">',
				'<a href="' + url + '"><span class="img"><img src="' + imgSrc + '" alt="' + name + '"></span>',
				'<span class="name">' + name + '</span></a>',
				'<div class="compare_item_remove"></div>',
				'</div>',
				'</div>'
			];
            //console.log(itemSrc.join(''));
			container.find('#compare_items').children('li').eq(list.length-1).append(itemSrc.join(''));
		}
	},
	
	remove: function (pid) {
		var self = this,
		    container = self.container,
			idx = self.list_ids.indexOf(pid);
			
		if (-1 === idx) return;
		self.list.splice(idx, 1);
		self.list_ids.splice(idx, 1);
		container.find("#compare_item_pid_" + pid).closest('li').remove();
		container.find("#compare_items").append('<li></li>');
		
		// Table内のボタンを「追加」に戻す
		self.listTable.find("#pid_" + pid).find(".btn_remove").removeClass('btn_remove').addClass('btn_add').text('追加')

		if(self.list.length < 2){
		    // 比較ボタンを押せなくする
		}
	},
	clear: function () {
		for (var a = this.list, l = a.length - 1; 0 <= l; l--) this.remove(a[l][0]);
	},
	compare: function () {
		var url = this.get_compare_url(),
		    win = window;
		if (!url) return;
		win.location !== win.parent.location ? win.open(a) : win.location = url;
	},
	get_compare_url: function () {
		var self = this,
			list = self.list,
			tmp = '',
			i;
			
		var compareUrl = '/compare.html'; // 要・パス修正
		
		if (2 > list.length) return "";
		for (i = 0; i < list.length; i++) {
			if(i != 0) tmp += '&'
			tmp += 'pid_' + (i+1) + '=' + list[i][0];
		}

		//console.log(compareUrl + '?' + tmp);
		
		return compareUrl + '?' + tmp;
	}
};


