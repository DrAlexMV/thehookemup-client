<!doctype html>
    <html lang="en">
        <head>
            <link href="select2-3.5.2/select2.css" rel="stylesheet"/>
            <script type="text/javascript" src="jquery-1.11.2.min.js"></script>
            <script type="text/javascript" src="mithril.js"></script>
            <script type="text/javascript" src="select2-3.5.2/select2.js"></script>
            <script type="text/javascript" src="Semantic-UI-1.5.2/dist/semantic.min.js"></script>
            <link rel="stylesheet" href="Semantic-UI-1.5.2/dist/semantic.min.css">


            </head>
            <body>

                <div id ="somename">
                </div>


                <script type="text/javascript">



                var ModalMixin = function () {



                    return function (body) {
                    var modal = {};


                    modal.vm = {
                    body: body,
                    displayed: m.prop(false)
                    };



                    //modal.stream = vm.body.stream;

                    modal.controller = function () {
                    var vm = modal.vm

                    this.checkDisplayed = m.prop(vm.displayed)

                    this.display = function () {
                    vm.displayed(true)
                    }
                    this.hide=function(){
                    vm.displayed(false)
                    }

                    };


                    modal.config = function(ctrl) {
                    return function(element, isInitialized) {

                    var el = $(element);

                    if (!isInitialized) {
                    //set up select2 (only if not initialized already)
                    if (ctrl.checkDisplayed())
                    {
                    $('.modal').modal('show');
                    }

                    //this event handler updates the controller when the view changes
                    el.on("change", function(e) {
                    //integrate with the auto-redrawing system...
                    m.startComputation();

                    //...so that Mithril autoredraws the view after calling the controller callback
                    document.write("modal changed");

                    m.endComputation();
                    //end integration
                    });
                    }

                    //update the view with the latest controller value
                    document.write("modal changed 2");
                    }
                    }


                    /*[
                     m('input[type=text]', { value:"test value",  onchange: m.withAttr(true, ctrl.displayed) }),
                     m("div", {config: body.config(ctrl)}, [
                     body.view()
                     ])
                     ]*/

                    //this view implements select2's `<select>` progressive enhancement mode
                    modal.view = function(ctrl) {
                    return (
                    m("div",[
                    m('input[type=text]', { value:"test value",  onchange: m.withAttr(true, ctrl.displayed) }),
                    m("div", {config: modal.config(ctrl)}, [
                    body.view()
                    ])
                    ]
                    ,"hey hey hey"))
                    };

                    return modal;
                    };
                    };
                body = {}
                body.view =function(ctrl){ return m('div.ui basic modal',  [
                    m('div.ui basic modal',[
                    m('i.close icon',[
                    m('div.header', 'Archive Old Messages'),
                    m('div.content',[
                    m('div.image',[
                    m('i.archive icon')

                    ]),
                    m('div.description',[
                    m('p', 'Your inbox is getting full, would you like us to enable automatic archiving of old messages?')
                    ])

                    ]),
                    m('div.actions',[
                    m('div.two fluid ui inverted buttons',[
                    m('div.ui red basic inverted button',[
                    m('i.remove icon','No')

                    ]),
                    m('div.ui green basic inverted button',[
                    m('i.checkmark icon','Yes')
                    ])
                    ])
                    ])
                    ])
                    ])
                    ])}

                body.controller=function()
{
    this.prop=function(){
        return 0
    };

    }
                //initialize
                m.module(document.getElementById("somename"), ModalMixin()(body));
                //module.exports = ModalMixin;
                </script>
            </html>

