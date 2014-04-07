'use strict';

var hostweburl;
var appweburl;
var splistid;
var id = 0;

function getQueryStringParameter(paramToRetrieve) {
    var params = document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve) return singleParam[1];
    }
}

function closeDialog(refresh) {
    var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
    if (refresh)
        target.postMessage('CloseCustomActionDialogRefresh', '*');
    else
        target.postMessage('CloseCustomActionDialogNoRefresh', '*');
}


// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    //Get the URI decoded URLs.
    hostweburl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
    appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));
    splistid = decodeURIComponent(getQueryStringParameter("SPListId"));

    //set up the view model
    var ViewModel = function () {
        var self = this;

        self.files = ko.observableArray();
        self.addFile = function (file, id, data) {
            var token = file.split('\\');
            var fn = token[token.length - 1];

            self.files.push({ id: id, name: fn, path: file, filedata: data});
        };
        self.removeFile = function () {
            var theFile = this;
            self.files.remove(this);
        };
        self.hasFiles = function () {
            return (self.files().length > 0);
        };
        self.contains = function (file) {
            for (var i = 0; i < self.files().length; i++) {
                if (self.files()[i].path == file) {
                    return true;
                }
            }
            return false;
        };
        self.uploadFiles = function () {
            var executor = new SP.RequestExecutor(appweburl);
            
            $.each(self.files(), function (index, file) {
                var name = file.name;
                // upload to the root folder
                var url = appweburl + "/_api/SP.AppContextSite(@TargetSite)/web/lists(@TargetLibrary)/RootFolder/Files/add(url=@TargetFileName,overwrite='true')?" +
                    "@TargetSite='" + hostweburl + "'" +
                    "&@TargetLibrary='" + splistid + "'" +
                    "&@TargetFileName='" + name + "'";

                executor.executeAsync({
                    url: url,
                    method: "POST",
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    contentType: "application/json;odata=verbose",
                    binaryStringRequestBody: true,
                    body: file.filedata,
                    success: function (data) {
                        self.files.remove(file);
                        $('#validationMessages').text("Success! Your file was uploaded to SharePoint.").show().fadeOut(5000);
                        self.uploadComplete();
                    },
                    error: function (data, errorCode, errorMessage) {
                        self.uploadErrors = true;
                        $('#validationMessages').text("Error! Something went wrong uploading your file." + errorMessage).show().fadeOut(5000);
                    }
                });
            });
        };
        self.uploadComplete = function () {
            if(!self.hasFiles()) {
                closeDialog(true);
            }
        };
    }

    //hook into client side events using jQuery
    $('#addButton').click(function () {
        var $inputElm = $('#selectFile');
        if ($inputElm.val().length == 0) {
            $('#file-selected').css({ 'border': '1px red solid' });
            $('#validationMessages').text('Please select a file to add').show().fadeOut(5000);
            return;
        }
        if (!vm.contains($inputElm.val())) {
            //read file data
            var reader = new FileReader();
            reader.onload = function (result) {
                var self = this;
                var fileData = '';
                var byteArray = new Uint8Array(result.target.result)
                for (var i = 0; i < byteArray.byteLength; i++) {
                    fileData += String.fromCharCode(byteArray[i])
                }
                vm.addFile($inputElm.val(), id++, fileData);
            };
            reader.readAsArrayBuffer($inputElm[0].files[0])

        } else {
            $('#validationMessages').text("File is already selected for upload").show().fadeOut(5000);
            return;
        }
    });

    // Ok button clicked
    $('#okButton').click(function () {
        if (vm.hasFiles()) {
            $('#uploadButton').text('Processing...');
            //upload files
            vm.uploadFiles();
            //reset upload button text
            $("#uploadButton").text("Upload");
        } else {
            $('#file-selected').css({ 'border': '1px red solid' });
            $('#validationMessages').text('You must select atleast one file to upload.').show().fadeOut(5000);
        }
    });

    // Cancel button clicked
    $('#cancelButton').click(function () {
        closeDialog(false);
    });

    //select file button clicked
    $('#selectFileButton').click(function () {
        $('#selectFile').click();
    });

    //hook into change event of file input control to set the display text box
    $('#selectFile').change(function () {
        $('#file-selected').val($(this).val());
    });

    //knockoutjs databinding
    var vm = new ViewModel();

    // Load the SP.RequestExecutor.js file.
    $.getScript(hostweburl + "/_layouts/15/SP.RequestExecutor.js", vm.loadDocumentLibraries);

    $(function () {
        ko.applyBindings(vm);
    });
});





