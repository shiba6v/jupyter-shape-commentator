define([
    'base/js/namespace',
    'base/js/events',
    ],
    function (Jupyter,events) {
        "use strict";
        function rewrite_with_cellmagic(cell, cellmagic){
            var callback_result = cell.get_callbacks();
            callback_result.iopub.output = function() { 
                var that = cell;
                // console.log(arguments);
                var data = arguments[0].content.data;
                // If it is NOT shape commentator result (e.g. stdio output), skip.
                if (data===undefined){
                    that.events.trigger('set_dirty.Notebook', {value: true});
                    that.output_area.handle_output.apply(that.output_area, arguments);
                    return;
                }
                data = data["text/plain"];
                data = data.slice(1,-1);
                data = data.replace(/\\n/g,"\n");
                cell.set_text(unescape(data));
            }
            var tmp_get_callbacks = cell.get_callbacks;
            cell.get_callbacks = function(){
                return callback_result;
            }
            var tmp_get_text = cell.get_text;
            cell.get_text = function () {
                return "%%"+cellmagic+"\n"+this.code_mirror.getValue();
            };
            cell.execute();
            cell.get_text = tmp_get_text;
            cell.get_callbacks = tmp_get_callbacks;
        }

        function shape_comment(){
            // console.log("Calling shape_comment");
            var cell = Jupyter.notebook.get_selected_cell();
            rewrite_with_cellmagic(cell, "shape_comment");
        }

        function shape_erase(){
            // console.log("Calling shape_erase");
            var cell = Jupyter.notebook.get_selected_cell();
            rewrite_with_cellmagic(cell, "shape_erase");
        }

        function load_ipython_extension() {
            // console.log("Calling load_ipython_extension");

            if (document.getElementById('shape_commentator_button')==null) {
                Jupyter.toolbar.add_buttons_group([{
                    'label': 'Shape',
                    'icon': 'fa-comment',
                    'callback': shape_comment,
                    'id': 'shape_commentator_button'
                }]);
            }

            if (document.getElementById('shape_commentator_erase_button')==null) {
                Jupyter.toolbar.add_buttons_group([{
                    'label': 'Shape',
                    'icon': 'fa-eraser',
                    'callback': shape_erase,
                    'id': 'shape_commentator_erase_button'
                }]);
            }

            function import_shape_commentator(){
                var options = {
                    silent: false,
                    store_history : false,
                    stop_on_error: false
                };
                console.log("Calling import_shape_commentator");
                var cell = Jupyter.notebook.get_selected_cell();
                var tmp_get_text = cell.get_text;
                cell.get_text = function () {
                    return "import shape_commentator.jupyter_ext";
                };
                cell.execute();
                cell.get_text = tmp_get_text;
            }

            events.on("kernel_ready.Kernel", function () {
                if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
                    import_shape_commentator();
                } else {
                    events.on("notebook_loaded.Notebook", function () {
                        import_shape_commentator();
                    })
                }
            });
        }

        return {
            load_ipython_extension: load_ipython_extension
        };
    }
);

console.log("Loading Jupyter Shape Commentator");