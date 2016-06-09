jQuery(document).ready(function() {
	jQuery('#${cycleID}').cycle({
		fx : '${cycleFX}',
		speed : ${cycleSpeed},
		timeout : ${cycleTimeout},
		prev : '#prev',
		next : '#next',
		pager : '#nav'
	});
});