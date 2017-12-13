
var rownum=1;
var sum="";
var $sender="";
var $newSender="";
var $isSenderSet=false;
var iswarning=false;
var iserror=false;
var isvalid=false;
var price={};
var total=0;
$('input[name="consignment"]').keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
             (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
             (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
             return;
         }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        	if (!iswarning) {
        		toastr.warning('تنها عدد مجاز است');
        		iswarning=true;
        	}
        	e.preventDefault();
        }
        if ($('input[name="consignment"]').val().length >= 17) {
        	if (!iserror) {
        		toastr.error('بیشتر از ۱۷ رقم وارد کردید');
        		iserror=true;
        	}
        	
        	e.preventDefault();
        }
    });

var mytable = $('#tblItems').DataTable({

	"language": {
		"sEmptyTable":     "هیچ داده ای در جدول وجود ندارد",
		"sInfo":           "نمایش _START_ تا _END_ از _TOTAL_ رکورد",
		"sInfoEmpty":      "نمایش 0 تا 0 از 0 رکورد",
		"sInfoFiltered":   "(فیلتر شده از _MAX_ رکورد)",
		"sInfoPostFix":    "",
		"sInfoThousands":  ",",
		"sLengthMenu":     "نمایش _MENU_ رکورد",
		"sLoadingRecords": "در حال بارگزاری...",
		"sProcessing":     "در حال پردازش...",
		"sSearch":         "جستجو:",
		"sZeroRecords":    "رکوردی با این مشخصات پیدا نشد",
		"oPaginate": {
			"sFirst":    "ابتدا",
			"sLast":     "انتها",
			"sNext":     "بعدی",
			"sPrevious": "قبلی"
		},
		"oAria": {
			"sSortAscending":  ": فعال سازی نمایش به صورت صعودی",
			"sSortDescending": ": فعال سازی نمایش به صورت نزولی"
		}
	},
	"paging": true,
	"lengthChange": false,
	"searching": false,
	"ordering": true,
	"info": true,
	"autoWidth": false,
	"sDom": 'lfrtip'
});
$("form").submit(function (e) {
	e.preventDefault();
	if ( ! mytable.data().count() ) {
		$isSenderSet=false;
		$newSender="";
	}
	var	$id = $('input[name=consignment]').val();
	if (!$isSenderSet) {
		$sender=$('#tags').val();
	}else{
		$newSender=$('#tags').val();
	}
	$isSenderSet=true;
	if ($newSender !="" && $sender != $newSender) {
		toastr.error('نماینده ی جدیدی انتخاب کردید !');
		return 0 ;
	}
	if ($id.substr(0,7)!=5410000 || $id.substr(14,3)!=101 ){
		toastr.error('فرمت بارنامه درست نیست');
		isvalid=false;
	}else{
		isvalid=true;
	}
	if (isvalid==true) {
		$.ajax({
			type: "GET",
			url: 'http://ip.jsontest.com/',
			data: {
				id : $id
			},
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			success: function (value) {
				value.price = 2620000;
				value.cod = "2620000"+" ریال";
				value.consignment=$id;
				value.peymentTerm="پس کرایه";
				mytable.row.add([rownum,value.consignment, value.cod,value.price+" ریال",value.peymentTerm,$sender,"<button name="+'"'+$id+'"'+"class="+'"'+"button"+'"'+">حذف</button>"]);
				mytable.order([ 0, 'desc']).draw();
				rownum++;
				price[$id] = value.price;
			},
			failure: function (result) { alert('Fail'); 
		}
	});
		$('input[name=consignment]').val("");
	}
});
$(document).on('click', 'button', function()
{
	var	$btnId = $(this).attr('name');
	$target=$(this).parent().parent();
	delete 	price[$btnId];
	$target.hide('slow', function(){ $target.remove(); 
		if ($('#tblItems tbody tr').length==0) {
			mytable.clear().draw();
			rownum=1;
		}
		
	});
});
$('#mainSubmit').click(function(e) {  
console.log(price);
total=0;
$.each(price, function(key, value)
{
    total+=value;
});
console.log(total);
});
$('#reset').click(function(e) {  
	location.reload();
});
var availableTags = [
"کرج",
"تهران",
"قزوین",
"گمرک",
"لرستان",
"خرمشهر",
"مشهد"
];
$( "#tags" ).autocomplete({
	source: availableTags
});