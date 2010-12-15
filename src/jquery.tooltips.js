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
 * To enable tooltips, do:
 *
 *     $(document).enableTooltips();
 *
 * To use a different id for the tooltip element than the default
 * 'tooltip', do:
 *
 *     $(document).enableTooltips({ tooltip_id: 'my-tip' });
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
  var tooltip_id, fade_in_delay, handlers;

  tooltip_id = 'tooltip';

  function find_tooltip() {
    return $('#' + tooltip_id);
  }

  function hide_tooltip() {
    find_tooltip().stop(true, true).fadeOut('fast');
  }

  handlers = {
    target: {
      mouseenter: function (e) {
	var tipText = $(this).data('tipText');
	if (tipText !== null && tipText.length > 0) {
	  find_tooltip()
	    .stop(true, true)
	    .css('display', 'none')
	    .text(tipText)
	    .delay(fade_in_delay)
	    .fadeIn('slow');
	}
      },
      mouseleave: hide_tooltip,
      mousedown: hide_tooltip,
      keydown: hide_tooltip
    },
    body: {
      mousemove: function (e) {
	var win      = $(window),
	    tooltip  = find_tooltip(),
	    max_left = win.width() - tooltip.outerWidth(),
	    max_top  = win.height() + win.scrollTop() - tooltip.outerHeight(),
	    left     = Math.min(e.pageX + 20, max_left),
            top      = Math.min(e.pageY + 10, max_top);

	if (e.pageX + 20 > left && e.pageY + 10 > top) {
	  left = e.pageX - tooltip.outerWidth() - 20;
	}
	tooltip.css({ left: left, top: top });
      }
    }
  };

  $.fn.extend({
    addTooltip: function(text) {
      return this.each(function () {
	$(this).data('tipText', text).bind(handlers.target);
      });
    },
    enableTooltips: function(options) {
      tooltip_id = (options || {}).tooltip_id || "tooltip";
      fade_in_delay = (options || {}).delay || 3000;
      $('<p id="' + tooltip_id + '"/>')
	.css({ display: 'none', position: 'absolute' })
	.appendTo('body');
      $('body').bind(handlers.body);
    }
  });
}(jQuery));
