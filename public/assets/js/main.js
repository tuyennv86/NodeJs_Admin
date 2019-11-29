$.noConflict();

jQuery(document).ready(function($) {

	"use strict";

	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	} );

	jQuery('.selectpicker').selectpicker;


	$('#menuToggle').on('click', function(event) {
		$('body').toggleClass('open');
	});

	$('.search-trigger').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});	

	if($('.form-validate').length > 0)
	{
		$('.form-validate').each(function(){
			var id = $(this).attr('id');
			$("#"+id).validate({
				errorElement:'small',
				errorClass: 'form-text',
				errorPlacement:function(error, element){
					element.parents('.col-md-9').append(error);
				},
				highlight: function(small) {
					$(small).closest('.col-md-9').removeClass('error success').addClass('error');
				},
				success: function(small) {
					small.addClass('valid').closest('.col-md-9').removeClass('error success').addClass('success');
				}
			});
		});
	}

	$("#checkAll").click(function () {
		//check all
		$('input:checkbox').not(this).prop('checked', this.checked);
		//remove disabled deleteAll
		var checkBoxes = $('.table tbody .checkItem');
		checkBoxes.change(function () {
			$('#bntdeleteList').prop('disabled', checkBoxes.filter(':checked').length < 2);
		});
		$('.table tbody .checkItem').change();
	});

	//remove disabled deleteAll
	var checkBoxes = $('.table tbody .checkItem');
	checkBoxes.change(function () {
		$('#bntdeleteList').prop('disabled', checkBoxes.filter(':checked').length < 2);
	});
	$('.table tbody .checkItem').change();
	
});
