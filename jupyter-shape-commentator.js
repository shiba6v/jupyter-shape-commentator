define([
    'base/js/namespace',
    ],
    function (Jupyter) {
        "use strict";
        function shape_comment(){
            var parent = document.getElementsByClassName("end_space")[0];
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
            var cell = Jupyter.notebook.get_selected_cell();
            var orig_text = cell.get_text();
            cell.set_text("%%shape_comment"+"\\n"+orig_text);
            cell.execute();
        }

        function shape_erase(){
            // var parent = document.getElementsByClassName("end_space")[0];
            // while (parent.firstChild) {
            //     parent.removeChild(parent.firstChild);
            // }
            // var cell = Jupyter.notebook.get_selected_cell();
            // var orig_text = cell.get_text();
            // cell.set_text("%%shape_erase"+"\\n"+orig_text);
            // cell.execute();
            var output_callback = function (out_data){
                console.log(out_data);
            };
            var callbacks = {
                iopub: {
                    output: output_callback
                }
            }
            var options = {
                silent: false,
                store_history : true,
                stop_on_error: false
            };
            cell.notebook.kernel.execute(code, callbacks, options);
        }
        function load_ipython_extension() {
            // if (document.getElementById('shape_commentator_button')!=null){
            //     document.getElementById('shape_commentator_button').remove();
            // }
            if (document.getElementById('shape_commentator_button')==null) {
                Jupyter.toolbar.add_buttons_group([{
                    'label': 'Shape',
                    'icon': 'fa-comment',
                    'callback': shape_comment,
                    'id': 'shape_commentator_button'
                }]);
            }

            // if (document.getElementById('shape_commentator_erase_button')!=null){
            //     document.getElementById('shape_commentator_erase_button').remove();
            // }
            if (document.getElementById('shape_commentator_erase_button')==null) {
                Jupyter.toolbar.add_buttons_group([{
                    'label': 'Shape',
                    'icon': 'fa-eraser',
                    'callback': shape_erase,
                    'id': 'shape_commentator_erase_button'
                }]);
            }
        }
        return {
            load_ipython_extension: load_ipython_extension
        };
    }
);