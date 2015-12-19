// Generated by CoffeeScript 1.9.3

/*

ModalFactory.create(opts)

This method creates DOM structure for bootstrap modal. It doesn't handle the
modal operations like close or hide...

opts (options)

  title (string): the modal title in the modal header
  size (string):  the modal size
  side (boolean): side modal or not?
  ajax (object): ajax content modal
  controls (list): control buttons in the modal footer.
  foldable (boolean): enable fold button

You will have to handle the events if you want to call this API to create modals.
The events:

- `dialog.close`: function(ui)
- `dialog.fold`: function(ui)
- `dialog.ajax.done`: function(ui)
 */

(function() {
  window.ModalFactory = {};

  ModalFactory.create = function(opts) {
    var content, dialog, footer, header, modalbody, ui;
    dialog = document.createElement("div");
    dialog.classList.add("modal-dialog");
    content = document.createElement("div");
    content.classList.add("modal-content");
    header = document.createElement("div");
    header.classList.add("modal-header");
    modalbody = document.createElement('div');
    modalbody.classList.add('modal-body');
    footer = document.createElement('div');
    footer.classList.add('modal-footer');
    content.appendChild(header);
    content.appendChild(modalbody);
    content.appendChild(footer);
    dialog.appendChild(content);
    ui = {
      dialog: $(dialog),
      body: $(modalbody),
      header: $(header),
      footer: $(footer),
      options: opts
    };
    this._buildHeader(ui, opts);
    if (opts != null ? opts.side : void 0) {
      dialog.classList.add("side-modal");
    }
    if (opts != null ? opts.size : void 0) {
      if (opts.size === "large") {
        dialog.classList.add("modal-lg");
      } else if (opts.size === "small") {
        dialog.classList.add("modal-sm");
      } else if (opts.size === "medium") {
        dialog.classList.add("modal-md");
      } else if (typeof opts.size === "string") {
        dialog.classList.add(opts.size);
      }
    }
    if (opts.controls) {
      this._buildFooter(ui, opts);
    }
    this._buildContent(ui, opts);
    return ui;
  };

  ModalFactory._buildHeader = function(ui, opts) {
    var $h4title, closeBtn, foldBtn, headerControls;
    ui.header.empty();
    headerControls = document.createElement("div");
    headerControls.classList.add("modal-header-controls");
    ui.header.append(headerControls);
    if (opts.foldable) {
      foldBtn = $("<button/>").attr("type", "button").addClass("fold-btn");
      foldBtn.append($("<span/>").addClass("fa fa-minus"));
      foldBtn.append($("<span/>").addClass("sr-only").text('Fold'));
      foldBtn.appendTo(headerControls);
      foldBtn.click(function(e) {
        return ui.dialog.trigger('dialog.fold', [ui]);
      });
    }
    closeBtn = $("<button/>").attr("type", "button").addClass("close");
    closeBtn.append($("<span/>").addClass("fa fa-remove"));
    closeBtn.append($("<span/>").addClass("sr-only").text('Close'));
    closeBtn.appendTo(headerControls);
    closeBtn.click(function(e) {
      return ui.dialog.trigger('dialog.close', [ui]);
    });
    $h4title = $('<h4/>').addClass('modal-title');
    if (opts.title) {
      $h4title.text(opts.title);
    }
    return $h4title.appendTo(ui.header);
  };

  ModalFactory._buildContent = function(ui, opts) {
    ui.body.empty();
    if (opts.ajax) {
      return this._buildAjaxContent(ui, opts);
    } else if (opts.content) {
      return ui.body.html(opts.content);
    }
  };

  ModalFactory._buildAjaxContent = function(ui, opts) {
    if (!opts.ajax.url) {
      alert("opts.ajax.url is not defined.");
    }
    return ui.body.asRegion().load(opts.ajax.url, opts.ajax.args, function() {
      return ui.dialog.trigger('dialog.ajax.done', [ui]);
    });
  };

  ModalFactory._buildFooter = function(ui, opts) {
    var controlOpts, i, len, ref, results;
    ui.footer.empty();
    ref = opts.controls;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      controlOpts = ref[i];
      results.push((function(_this) {
        return function(controlOpts) {
          var $btn;
          $btn = $('<button/>').text(controlOpts.label).addClass('btn');
          if (controlOpts.primary) {
            $btn.addClass('btn-primary');
          }
          if (controlOpts.close) {
            $btn.click(function(e) {
              return $(dialog).trigger('dialog.close', [ui]);
            });
          } else {
            $btn.click(function(e) {
              if (controlOpts.onClick) {
                return controlOpts.onClick(e, ui);
              }
            });
          }
          return $btn.appendTo(ui.footer);
        };
      })(this)(controlOpts));
    }
    return results;
  };

  ModalFactory.createContainer = function() {
    var modal;
    modal = document.createElement("div");
    modal.classList.add("modal-container");
    return modal;
  };

}).call(this);
