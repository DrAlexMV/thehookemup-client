/**
 * @jsx m
 */

var Dropzone = require('common/form-builder').inputs.dropzone;
var ImageModel = require('model/image');
var StreamCommon = require('common/stream-common');

var EditableImage = function () {
    var editableImage = {};
    
    var vm =
    editableImage.vm = {
        step : m.prop('display')
    };

    editableImage.stream = new Bacon.Bus();

    StreamCommon.on(editableImage.stream, 'Dropzone::Success', function (message) {
        editableImage.stream.push(
            new StreamCommon.Message(
                'EditableImage::ReplaceImageURL',
                message.parameters)
        );
        vm.step('display');
    });

    editableImage.view = function (props) {
        var userImageURL = props.userImageURL,
                photoUrl = userImageURL ? ImageModel.getURL(userImageURL) : '/img/square-image.png';

        var stepView = null;
        if (vm.step() == 'display') {
            stepView = (
                <div className="content">
                    {userImageURL ?
                        <a className="ui right corner label" onclick={
                            function() {console.log('remove photo', userImageURL)}}>
                            <i className="close icon"></i>
                        </a>
                        : null
                    }
                    <div className="center">
                        <div className="ui inverted button" onclick={
                            function() {vm.step('upload')}}>
                            {userImageURL ? 'Change Photo' : 'Add Photo'}
                        </div>
                    </div>
                </div>
            );
        } else if (vm.step() == 'upload') {
            stepView = (
                <div className="content">
                    <a className="ui right corner label" onclick={function() {
                        vm.step('display');
                        console.log('display');
                    }}>
                        <i className="close icon"></i>
                    </a>
                    <div className="center">
                        {Dropzone('myDropzone', {url: ImageModel.postURL()}, editableImage.stream)}
                    </div>
                </div>
            );
        }

        if (props.editable) {
            return (
                <div className={((vm.step() == 'display') ? 'cssDimmer' : '') + ' image'}>
                    <div className="ui active dimmer">
                        {stepView}
                    </div>
                    <img className={ "ui image " + props.imageClasses } src={photoUrl} />
                </div>
            );
        } else {
            return (
                <div className="image">
                    <img className={ "ui image " + props.imageClasses } src={photoUrl} />
                </div>
            );
        }
    };

    return editableImage;
};

module.exports = EditableImage;
