<%@ Page Title="ZipFile" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ZipFile.aspx.cs" Inherits="XfinityTools.Tools.ZipFile" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <script src="FileZip.js"></script>

    <div>
         
    <asp:FileUpload ID="FileUpload1" runat="server" class="btn btn-primary btn-md" AllowMultiple="true" /><br />
    <ul style="border: transparent;  background-color: transparent; margin: auto;" class="file-input" id="fileList"></ul><br />
    <asp:Button ID="downloadButton" class="btn btn-primary btn-md" Text="Download Zip" runat="server" />
    </div>
    
        
    <br /><br />
    <div class="container-infobox-left">
        <p>The Create Zip Tool is a free online JavaScript-based tool that allows you to create a zip file containing selected files from your computer.</p>
        <br />
        
            <h2>Instructions:</h2>
            <h2>Step 1: Select Files</h2>
            <p>
                1. Click the "Choose Files" button below to open the file selection dialog.
            </p>
            <p>
                2. In the dialog, navigate to the folder where your desired files are located.
            </p>
            <p>
                3. Select one or multiple files by holding the Ctrl key (or Command key on Mac) and clicking on the files.
            </p>
            <p>
                4. After selecting the files, click the "Open" button in the file selection dialog.
            </p>
            <p>
                5. The selected file names will be displayed in the list below.
            </p>
            <h2>Step 2: Create Zip File</h2>
            <p>
                1. Once you have selected the desired files, click the "Download Zip" button.
            </p>
            <p>
                2. The tool will process the selected files and create a zip file containing them.
            </p>
            <p>
                3. If you haven't selected any files, an alert message will be displayed, and the zip file creation process will not proceed.
            </p>
            <h2>Step 3: Download the Zip File</h2>
            <p>
                1. After the zip file is generated, a file save dialog will appear in your browser.
            </p>
            <p>
                2. Choose the download location on your computer and click the "Save" or "OK" button.
            </p>
            <p>
                3. The zip file will be downloaded to your selected location with the name "files.zip".
            </p>
            <h2>Additional Information</h2>
            <p>
                - The Create Zip Tool only works in modern web browsers that support the necessary JavaScript functionalities. Ensure you are using an up-to-date browser.
            </p>
            <p>
                - This tool runs entirely on the client-side (in the user's browser). No files are sent to a server during the zip file creation process.
            </p>
            
       
    </div>
    
    
</asp:Content>
