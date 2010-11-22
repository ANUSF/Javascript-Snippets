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
 * A simple way of letting users select multiple files for upload.
 *
 * The format of parameter names and ids follows Rails conventions and
 * must be of a form similar to the markup example below, which would
 * be accompanied by code like the following (with Article#uploads and
 * Attachment#content being pseudo-attributes not stored in the
 * database):
 *
 *     # -- in app/models/article.rb:
 *
 *     has_many :attachments
 *
 *     def uploads
 *       [Attachment.new]
 *     end
 *
 *     def uploads_attributes=(data)
 *       data.each do |k, params|
 *         unless params[:content].blank? or params[:use] == "0"
 *           attachments.create(params)
 *         end
 *       end
 *     end
 *
 *     # -- in app/models/attachment.rb:
 *
 *     def content
 *       ""
 *     end
 *
 *     def content=(uploaded)
 *       self.name = uploaded.original_filename
 *       self.data = uploaded.read
 *     end
 *
 *
 * Usage example:
 *
 *     $('input:file.multi').multiFile();
 *
 * Example markup:
 *
 *     <input class='multi' size='0' type='file'
 *            id='article_uploads_attributes_0_content'
 *            name='article[uploads_attributes][0][content]' />
 */

/*jslint white: false, browser: true */
/*global jQuery */

(function($) {
  function file_selected() {
    var elem     = $(this),
        new_elem = elem.clone(true),
        id       = elem.attr('id'),
        name     = elem.attr('name'),
	n        = parseInt(id.match(/\d+/), 10) + 1,
	hidden   = $('<input type="hidden" value="0"/>'),
	checkbox = $('<input type="checkbox" checked="" value="1"/>');

    new_elem
      .attr('value', '')
      .attr('id', id.replace(/\d+/, n))
      .attr('name', name.replace(/\d+/, n))
      .removeClass('dirty');
    hidden
      .attr('name', name.replace(/\[[^\[\]]*\]$/, '[use]'));
    checkbox
      .attr('name', name.replace(/\[[^\[\]]*\]$/, '[use]'))
      .attr('id', id.replace(/_[^_]*$/, '_use'));
    elem
      .addClass('dirty')
      .css({ display: 'none' })
      .after('<p/>').next()
      .append(hidden)
      .append(checkbox)
      .append(elem.val().replace(/^.*[\/\\]/, ''))
      .after(new_elem);
  }

  $.fn.extend({
    multiFile: function () {
      return this.each(function () {
	$(this).change(file_selected);
      });
    }
  });
}(jQuery));
