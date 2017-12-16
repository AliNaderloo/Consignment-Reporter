
var rownum=1;
var sum="";
var $sender="";
var $newSender="";
var $isSenderSet=false;
var iswarning=false;
var iserror=false;
var isValid=false;
var price={};
var cod={};
var $Agent="";
var totalPrice=0;
var totalCod=0;
var availableTags =  [];
var agentNotExist=false;

var colors = ['steelblue', 'salmon', 'lightcoral', 'cadetblue', 'dimgray', 'cornflowerblue', 'indianred', 'lightseagreen','#0881A3','#C06C84'];
color = colors[Math.floor(Math.random() * colors.length)];
String.prototype.toEnDigit = function() {
	return this.replace(/[\u06F0-\u06F9]+/g, function(digit) {
		var ret = '';
		for (var i = 0, len = digit.length; i < len; i++) {
			ret += String.fromCharCode(digit.charCodeAt(i) - 1728);
		}

		return ret;
	});
};
$('html').css("background-color",color);
$('#submit').css("background-color",color);
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
	"pageLength": 80,
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

$('#tblItems').on('click', 'button', function()
{
	var	$btnId = $(this).attr('name');
	$target=$(this).parent().parent();
	delete 	price[$btnId];
	delete  cod[$btnId];
	$target.hide('slow', function(){ mytable.row( $target ).remove().draw(); 
		if ($('#tblItems tbody tr').length==0) {
			mytable.clear().draw();
			$("#tags").removeAttr("disabled"); 
			rownum=1;
		}
	});
});
$('#submit').click(function(e) { 
	if (!mytable.rows().any()) {
		toastr.error('اطلاعاتی وارد نکردید !');
		$("a[href='modal']").attr('disabled', true);
		return false;
	}else{
		
		var consignment=[];
		totalPrice=0;
		totalCod=0;
		 var countRows=mytable.rows().count();
		$.each(price, function(key, value)
		{
			totalPrice+=parseInt(value);
			consignment.push(key);
		});
		$.each(cod, function(key, value)
		{
			totalCod+=parseInt(value);
		});
		$('#countRows').text(countRows);
		$("a[href='modal']").attr('disabled', false);
		var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
		$('#numberTotalPrice').animateNumber(
		{
			number: totalPrice,
			numberStep: comma_separator_number_step
		}
		);
		$('#numberTotalCod').animateNumber(
		{
			number: totalCod,
			numberStep: comma_separator_number_step
		}
		);
	}
	
});
$(document).on('confirmation', '#modal', function () {
	var consignment=[];
	totalPrice=0;
	totalCod=0;
	$.each(price, function(key, value)
	{
		totalPrice+=parseInt(value);
		consignment.push(key);
	});
	$.each(cod, function(key, value)
	{
		totalCod+=parseInt(value);
	});
	$jsonConsignment=JSON.stringify(consignment);
	$.ajax({
		method: "POST",
		url: "http://api.parschapar.local/fetch_agent",
		headers: {"APP-AUTH": "aW9zX2N1c3RvbWVyX2FwcDpUUFhAMjAxNg=="},
		data : {
			'consignments' : $jsonConsignment,
			'totalPrice' :totalPrice,
			'agent':$Agent
		},
		success: function(data){

		},
		error: function(data){
                // Something went wrong
                // HERE you can handle asynchronously the response 
                // Log in the console
                //console.log(data);
            }
        });
/*	console.log($jsonConsignment);
	console.log("Price :"+totalPrice);
	console.log("Cod :"+totalCod);
	console.log("Agent :"+$Agent);
	rownum=1;
	mytable.clear().draw();
	$("#tags").removeAttr("disabled");*/
	//alert($Agent);
	//location.reload();
	var inst = $('[data-remodal-id=modal1]').remodal();
	inst.open();
	rownum=1;
	mytable.clear().draw();
	var consignment=[];
	totalPrice=0;
	totalCod=0;
	$("#tags").removeAttr("disabled");
	$('input[name=consignment]').focus();
});
$('#reset').click(function(e) {  
	location.reload();
});
$.ajax({
	method: "POST",
	url: "http://api.parschapar.local/fetch_agent",
	headers: {"APP-AUTH": "aW9zX2N1c3RvbWVyX2FwcDpUUFhAMjAxNg=="},
	success: function(data){
		$.each(data['objects']['user'], function(key, value)
		{
			availableTags.push({"label" :value['full_name'],"id":value['user_no']});
		});
	},
	error: function(data){
                // Something went wrong
                // HERE you can handle asynchronously the response 
                // Log in the console
                //console.log(data);
            }
        });
$( "#tags" ).autocomplete({
	source: availableTags,
	select: function(event,ui){
		$(this).val((ui.item ? ui.item.label : ""));
		$Agent=ui.item.id; 
	}
});
$("form").submit(function (e) {
	e.preventDefault();
	$('input[name=consignment]').attr('disabled', true);
	agentNotExist=true;
	var isExist=false;
	e.preventDefault();
	if ( ! mytable.data().count() ) {
		$isSenderSet=false;
		$newSender="";
	}
	var	$id = $('input[name=consignment]').val().toEnDigit();
	if ($id=="") {
		toastr.error('شماره بارنامه را وارد کنید !');
		$('input[name=consignment]').removeAttr("disabled"); 
		return 0;
	}
	if (!$isSenderSet) {
		$sender=$('#tags').val();
	}else{
		$newSender=$('#tags').val();
	}
	$isSenderSet=true;
	if ($newSender !="" && $sender != $newSender) {
		toastr.error('نماینده ی جدیدی انتخاب کردید !');
		$('input[name=consignment]').removeAttr("disabled"); 
		return 0 ;
	}
	if ($id.substr(0,7)!=5410000 || $id.substr(14,3)!=101 ){
		toastr.error('فرمت بارنامه درست نیست');
		$('input[name=consignment]').val("");
		$('input[name=consignment]').focus();
		isValid=false;
	}else{
		isValid=true;
	}
	$('#tblItems > tbody  > tr').each(function() {
		var tblId =$(this).find("td:eq(1)").text();
		if (tblId ==$id) {
			toastr.error('بارنامه تکراری است !');
			$('input[name=consignment]').removeAttr("disabled"); 
			$('input[name=consignment]').val("");
			$('input[name=consignment]').focus();
			isExist=true;
		}
	});
	if ($('#tags').val()=="") {
		toastr.error('نماینده را مشخص کنید !');
		$('#tags').select();
		$('input[name=consignment]').removeAttr("disabled"); 
		return 0 ;
	}
	$.each(availableTags, function(key, value)
	{
		if ($('#tags').val()==value['label']) {
			agentNotExist=false;
		}
	});
	if (agentNotExist==true) {
		toastr.error('نماینده وجود ندارد !');
		$('#tags').select();
		$('input[name=consignment]').removeAttr("disabled"); 
		return 0 ;
	}
	if (isValid==true && isExist==false && agentNotExist==false) {
		$.ajax({
			type: "GET",
			url: 'http://localhost/Barname/api.php',
			data: {'id': $id},
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			success: function (value) {
				if (value.notFound==false) {
					if (value.TermsOfPayment==0) {
						value.TermsOfPayment="پیش کرایه";
					}else{
						value.TermsOfPayment="پس کرایه";
					}
					value.consignment=$id;
					mytable.row.add([rownum,value.consignment,value.TermsOfPayment,$sender,value.InvValue,value.fld_Total_Cost,(parseInt(value.fld_Total_Cost)+parseInt(value.InvValue)),"<button name="+'"'+$id+'"'+"class="+'"'+"button"+'"'+">حذف</button>"]);
					mytable.order([ 0, 'desc']).draw();
					rownum++;
					price[$id] = value.fld_Total_Cost;
					cod[$id]=value.InvValue;
					$("#tags").attr("disabled", "disabled");
					$('input[name=consignment]').removeAttr("disabled"); 
					$('input[name=consignment]').val("");
					$('input[name=consignment]').focus();
				}else{
					toastr.error('بارنامه ای با این شماره ثبت نشده است');
					$('input[name=consignment]').removeAttr("disabled"); 
					$('input[name=consignment]').val("");
					$('input[name=consignment]').focus();

				}},
				fail: function (result) { alert('Fail'); 
			}
		});
	}
});
