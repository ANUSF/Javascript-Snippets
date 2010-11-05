/**
 * jquery.djtch.js - Dynamic Javascript Templating in Client-side HTML
 *
 * Requires jquery (>= 1.3) and jquery.forms
 *
 * @author olaf.delgado-friedrichs@anu.edu.au
 */

/*jslint white: false, browser: true */
/*global jQuery, window, confirm */

jQuery.djtch = {
  options: {
    preUpdateHook: null,
    postUpdateHook: null
  },
  setup: function (options) {
    jQuery.extend(this.options, options || {});
  },
  anchor: function (seed, item) {
    var id = jQuery(item).attr('id'),
      pattern = ".dj-anchor" + (id ? '#' + id : ''),
      context = seed,
      res;
    while (context.length > 0) {
      res = context.is(pattern) ? context : context.find(pattern);
      if (res.length > 0) {
	return res;
      }
      if (!context.parent()) {
	break;
      }
      context = context.parent().closest('.dj-context,.dj-anchor');
    }
    return jQuery(pattern);
  },
  content: function (item) {
    var x = jQuery(item);
    return x.hasClass('.dj-children') ? x.children() : x;
  },
  update: function (seed, html) {
    var anchor = this.anchor,
      content = this.content,
      newStuff = jQuery(html);
    if (this.options.preUpdateHook) {
      this.options.preUpdateHook(newStuff);
    }
    newStuff.djtchEnable();
    newStuff.find('.dj-replace').each(
      function (i) { anchor(seed, this).replaceWith(content(this)); }
    ).end().find('.dj-append').each(
      function (i) { anchor(seed, this).append(content(this)); }
    ).end().find('.dj-prepend').each(
      function (i) { anchor(seed, this).prepend(content(this)); }
    ).end().find('.dj-after').each(
      function (i) { anchor(seed, this).after(content(this)); }
    ).end().find('.dj-before').each(
      function (i) { anchor(seed, this).before(content(this)); }
    );
    if (this.options.postUpdateHook) {
      this.options.postUpdateHook();
    }
  },
  stopScrollHandler: function () {
    jQuery(window).unbind('scroll', this.handlers.activeScroll);
  },
  handlers: {
    linkClicked: function () {
      var link = jQuery(this);
      jQuery.get(
	link.attr('href'),
	function (html) {
	  jQuery.djtch.update(link, html);
	  if (link.hasClass('.dj-once')) {
	    link.unbind('click');
	  }
	}
      );
      return false;
    },
    deleteLinkClicked: function () {
      var link = jQuery(this);
      if (confirm(link.attr('confirm') || 'Really delete this?')) {
	jQuery.post(
	  link.attr('href'),
	  jQuery.param({ '_method': 'delete' }),
	  function (html, status) {
	    jQuery.djtch.update(link, html);
	  }
	);
      }
      return false;
    },
    activeScroll: function (event) {
      var win = jQuery(window),
	link = event.data,
	doc = jQuery(document);
      if (link && link.attr('href')) {
	if (win.scrollTop() + 1.1 * win.height() > doc.height()) {
	  jQuery.djtch.stopScrollHandler();
	  jQuery.get(
	    link.attr('href'),
	    function (html) {
	      jQuery.djtch.update(link, html);
	    }
	  );
	}
      } else {
	jQuery.djtch.stopScrollHandler();
      }
      return false;
    },
    formSubmitted: function () {
      var input = jQuery(this),
	form  = input.closest('form');
      form.append("<input type='hidden' name='" + input.attr('name') +
		  "' value='" + input.attr('value') + "' class='tmp'>");
      form.ajaxSubmit(
	{
	  url: form.attr('action'),
	  success: function (html, status) {
	    jQuery("input.tmp", form).remove();
	    jQuery.djtch.update(form, html);
	  }
	}
      );
      return false;
    }
  }
};

jQuery.fn.extend(
  {
    djtchLink: function () {
      return this.click(jQuery.djtch.handlers.linkClicked);
    },
    djtchDeleteLink: function () {
      return this.click(jQuery.djtch.handlers.deleteLinkClicked);
    },
    djtchOnScrollLink: function () {
      if (this.length > 0) {
	var ev = 'scroll',
	  fn = jQuery.djtch.handlers.activeScroll;
	jQuery(window).unbind(ev, fn)
	  .bind(ev, this, fn).triggerHandler(ev);
      }
      return this.hide().after(this.text());
    },
    djtchForm: function () {
      return this.find('input[type=submit]')
	.click(jQuery.djtch.handlers.formSubmitted).end();
    },
    djtchEnable: function () {
      return this
	.find('.dj-link').djtchLink().end()
	.find('.dj-delete').djtchDeleteLink().end()
	.find('.dj-scroll').djtchOnScrollLink().end()
	.find('.dj-form').djtchForm().end();
    }
  }
);
