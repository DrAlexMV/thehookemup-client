var ModalMixin = function () {



    return function (body) {
        var modal = {};

        var vm =
            modal.vm = {
                body: body

            };


        //modal.stream = vm.body.stream;

        modal.controller = function () {
            body.controller();
        };


        body.config = function(ctrl) {
            return function(element, isInitialized) {

                var el = $(element);

                if (!isInitialized) {
                    //set up select2 (only if not initialized already)
                    $('.modal').modal('show');
                    //this event handler updates the controller when the view changes
                    el.on("change", function(e) {
                        //integrate with the auto-redrawing system...
                        m.startComputation();

                        //...so that Mithril autoredraws the view after calling the controller callback
                        el.modal('show');

                        m.endComputation();
                        //end integration
                    });
                }

                //update the view with the latest controller value
                el.select2("val", ctrl.value);
            }
        }

        //this view implements select2's `<select>` progressive enhancement mode
        modal.view = function(ctrl) {
            return m("div", {config: body.config(ctrl)}, [
                body.view()
            ]);
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

body.controller = function () { return 0 }
//initialize
m.module(document.getElementById("somename"), ModalMixin()(body));