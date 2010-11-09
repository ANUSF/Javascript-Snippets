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

  handlers = {
    field: {
      mousedown: function () {
	var field    = $(this),
	    pulldown = $(field.data('pulldown'));
	pulldown.toggle();
      },
      focus: function () {
	var field    = $(this),
	    pulldown = $(field.data('pulldown'));

	$(all_pulldowns).each(function () {
	  $(this).css({ display: 'none' });
	});
	pulldown.each(function () {
	  $(this).css({ display: 'block', left: field.position().left });
	});
      },
      blur: function () {
       var field    = $(this),
           pulldown = $(field.data('pulldown'));
       setTimeout(function() {
         if ($("*:focus").attr('id') !== pulldown.attr('id')) {
           pulldown.css({ display: 'none' });
         }
       }, 100);
      },
      keyup: function () {
       var field    = $(this),
           pulldown = $(field.data('pulldown'));
       setTimeout(function() {
         pulldown.css({ display: 'none' });
       }, 100);
      }
    },
    pulldown: {
      blur: function () {
       $(this).css({ display: 'none' });
      },
      click: function () {
        var pulldown = $(this),
	    field    = $(pulldown.data('field'));
	setTimeout(function() {
	  field.val(pulldown.val()).trigger('keyup');
	}, 100);
      }
    }
  };

  $.fn.extend({
    addPulldown: function (pulldown) {
      return this.each(function () {
	all_pulldowns.push(pulldown);
	$(this).data('pulldown', pulldown.get(0)).bind(handlers.field);
	pulldown.data('field', this).bind(handlers.pulldown);
      });
    }
  });
}(jQuery));
