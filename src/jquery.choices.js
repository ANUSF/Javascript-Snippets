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

/**
 * A jQuery plugin that implements pulldown menues for text fields.
 *
 * The 'setTimeout' calls, explicit manipulation of the 'display'
 * property and other strange quirks of the code were necessary in
 * order to make things work properly in Internet Explorer.
 *
 * Usage example:
 *
 *     $('input:text[data-pulldown-id]').each(function () {
 *       $(this).addPulldown($('#' + $(this).attr('data-pulldown-id')));
 *     }
 */

/*jslint white: false, browser: true */
/*global jQuery */

(function($) {
  var all_pulldowns = [], handlers;

  function hide_all_pulldowns() {
    $(all_pulldowns).each(function () {
      $(this).css({ display: 'none' });
    });
  }

  function set_position(pulldown) {
    var field = $(pulldown.data('field')),
        pos   = field.offset();
    if (pos) {
      pulldown.css({ left: pos.left, top: pos.top + field.outerHeight() });
    }
  }

  handlers = {
    field: {
      click: function () {
	return false;
      },
      focus: function () {
	var field    = $(this);

	hide_all_pulldowns();
	$(field.data('pulldown')).each(function () {
	  $(this).data('field', field).css({ position: 'absolute',
					     display: 'block' });
	  set_position($(this));
	});
	return false;
      },
      keyup: function () {
	$($(this).data('pulldown')).css({ display: 'none' });
      }
    },
    pulldown: {
      click: function (event) {
        var target = $(event.target),
	    text   = target.hasClass('empty') ? '' : target.text();
	$($(this).data('field')).val(text).trigger('keyup');
	return false;
      }
    }
  };

  $.fn.extend({
    addPulldown: function (pulldown) {
      return this.each(function () {
	var pulldown_element = pulldown.get(0);
	if ($.inArray(pulldown_element, all_pulldowns) < 0) {
	  all_pulldowns.push(pulldown_element);
	}
	$(this)
	  .data('pulldown', pulldown_element)
	  .bind(handlers.field);
	pulldown
	  .bind(handlers.pulldown)
	  .addClass('pulldown')
	  .appendTo('body');
      });
    }
  });

  $(document).ready(function() {
    $('body').click(hide_all_pulldowns);
  });
}(jQuery));
