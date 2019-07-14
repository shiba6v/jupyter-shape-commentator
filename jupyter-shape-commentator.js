define([
    'base/js/namespace',
    'base/js/events',
    ],
    function (Jupyter,events) {
        "use strict";
        function shape_comment(){
            console.log("Calling shape_comment");
            var output_callback = function (out_data){
                console.log(out_data);
                // TODO on_error
                var data = out_data.content.data["text/plain"];
                // delete unused quotation
                data = data.slice(1,-1);
                data = data.replace(/\\n/g,"\n");
                cell.set_text(unescape(data));
            };
            var callbacks = {
                iopub: {
                    output: output_callback
                }
            }
            var options = {
                silent: false,
                store_history : false,
                stop_on_error: false
            };
            var cell = Jupyter.notebook.get_selected_cell();
            var code = cell.get_text();
            cell.notebook.kernel.execute("%%shape_comment"+"\n"+code, callbacks, options);
        }

        function shape_erase(){
            console.log("Calling shape_erase");
            var cell = Jupyter.notebook.get_selected_cell();
            var output_callback = function (out_data){
                console.log(out_data);
                // TODO on_error
                var data = out_data.content.data["text/plain"];
                // delete unused quotation
                data = data.slice(1,-1);
                data = data.replace(/\\n/g,"\n");
                cell.set_text(unescape(data));
            };
            var callbacks = {
                iopub: {
                    output: output_callback
                }
            }
            var options = {
                silent: false,
                store_history : false,
                stop_on_error: false
            };
            var code = cell.get_text();
            cell.notebook.kernel.execute("%%shape_erase"+"\n"+code, callbacks, options);
        }

        function load_ipython_extension() {
            console.log("Calling load_ipython_extension");

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
            cell.notebook.kernel.execute("import shape_commentator.jupyter_ext", {}, options);
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