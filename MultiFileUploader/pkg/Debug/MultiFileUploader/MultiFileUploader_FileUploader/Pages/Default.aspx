<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>
<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Bootstrap CDN -->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" />

    <!-- Include Knockoutjs -->
    <script type="text/javascript">
        var path = (("https:" == document.location.protocol) ? "https://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js" : "http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js");
        document.write(unescape("%3Cscript src='" + path + "' type='text/javascript'%3E%3C/script%3E"));
    </script>

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>

    <!-- Latest compiled and minified JavaScript -->
    <script type="text/javascript" src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>

   <WebPartPages:AllowFraming runat="server" />
</asp:Content>


<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <!-- Hidden Input file control -->
    <input type="file" id="selectFile" style="display:none;"/>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-8">
                <span id="validationMessages" class="warning"></span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <label for="selectFile" class="control-label">Select file</label>
                <div class="row">
                    <div class="col-md-8">
                        <div class="col-xs-8">
                            <input id="file-selected" type="text" class="form-control input-sm" />
                        </div>
                        <a id='selectFileButton' class="btn btn-default btn-xs">Browse</a>
                        <button id="addButton" type="button" class="btn btn-primary btn-xs">Add</button>
                    </div>
                </div>
            </div>
        </div>
        <br />
        <div class="row">
            <div class="col-md-8">
                <table class="table table-condensed">
                    <tbody data-bind="foreach: files" >
                        <tr>
                            <td data-bind="text: name"></td>
                            <td>
                                <a href="#" data-bind="click: $parent.removeFile" style="color:blue;">
                                    <img alt="delete" src="../images/delitem.png" />
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="row">
            <div class="col-md-2">
                <!-- Ok Button -->
                <button id="okButton" class="btn btn-primary" type="button" value="OK">OK</button>
                <!-- Cancel Button -->
                <button id="cancelButton" class="btn btn-default" type="button" value="Cancel">Cancel</button>
            </div>
        </div>
    </div>
</asp:Content>
