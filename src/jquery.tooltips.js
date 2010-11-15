/*
 * Author: Olaf Delgado-Friedrichs (odf@github.com)
 * Copyright (c) 2010 ANU
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * Prettier tooltips via Javascript and jQuery.
 *
 * To nap the tooltips from the title attributes, do:
 *     $('*[title]').each(function () {
 *       $(this).addTooltip($(this).attr('title')).removeAttr('title');
 *     });
 *
 * Styling example:
 *     #tooltip {
 *       background-color: #ffc;
 *       border:           1px solid #ccc;
 *       padding:          2px;
 *       text-align:       left;
 *       width:            20em;
 *     }
 */

/*jslint white: false, browser: true */
/*global jQuery, window */

(function($) {
  function tooltip_css(tooltip, mouse_x, mouse_y) {
    var win  = $(window),
        left = Math.min(mouse_x + 20, win.width() - tooltip.outerWidth()),
        top  = Math.min(mouse_y + 10,
		        win.height() + win.scrollTop() - tooltip.outerHeight());
    if (mouse_x + 20 > left && mouse_y + 10 > top) {
      left = mouse_x - tooltip.outerWidth() - 20;
    }
    return { left: left, top:  top };
  }

  $.fn.addTooltip = function(text) {
    return this.each(function () {
      $(this)
	.data('tipText', text)
	.hover(
	  function(e) {
	    var tipText = $(this).data('tipText'),
	        tooltip = $('#tooltip').first();
	    if (tipText !== null && tipText.length > 0) {
	      tooltip
		.stop(true, true)
		.css('display', 'none')
		.text(tipText)
		.css(tooltip_css(tooltip, e.pageX, e.pageY))
		.delay(1000)
		.fadeIn('slow');
	    }},
	  function() { $('#tooltip').stop(true, true).fadeOut('fast'); })
	.click(function() { $('#tooltip').stop(true, true).fadeOut('fast'); })
	.mousemove(function(e) {
	  var tooltip = $('#tooltip');
	  tooltip.css(tooltip_css(tooltip, e.pageX, e.pageY));
	});
    });
  };

  $(document).ready(function() {
    $('<p id="tooltip"/>')
      .css({ display: 'none', position: 'absolute' })
      .appendTo('body');
  });
}(jQuery));
