import * as React from "react";

interface FileViewProps {
    file: File;
    showClear?: boolean;
    onClear?: () => void;
    bottomMargin?: boolean;
}

class FileView extends React.Component<FileViewProps, {}> {
    render(){
        var { file, showClear, onClear, bottomMargin } = this.props;
        var name = file.name;
        var extension = name.substring(name.length - 4, name.length);
        
        var iconClass = "file-upload";
        switch(extension){
            case "xlsx":
            case ".xls":
                iconClass = "file-excel";
                break;
            case "docx":
            case ".doc":
                iconClass = "file-word";
                break;
            case "pptx":
            case ".ppt":
                iconClass = "file-powerpoint";
                break;
            case ".pdf":
                iconClass = "file-pdf";
                break;
        }
    
        var size = `${(file.size / 1000).toFixed(1)} KB`;
        if(file.size > 1024000){
            size = `${(file.size / 1000000).toFixed(2)} MB`;
        }

        return (
            <div className={bottomMargin ? "uk-margin-small-bottom" : null}>
                <div className="uk-card-small">
                    <div className="uk-card-body uk-card-default uk-grid uk-grid-small uk-margin-remove-left">
                        <div className="uk-width-auto uk-flex uk-flex-middle">
                            <i className={`fas fa-${iconClass} fa-lg`}></i>
                        </div>
                        <div className="uk-width-expand uk-flex uk-flex-middle">
                            <h5 className="uk-text-truncate" data-uk-tooltip={`title:${name}`}>{name}</h5>
                        </div>
                        <div className="uk-width-auto uk-flex uk-flex-middle">
                            <p className="uk-text-meta">{size}</p>
                        </div>
                        {showClear ? 
                        (<div className="uk-width-auto uk-flex uk-flex-middle">
                            <button className='uk-button uk-button-default uk-button-small' onClick={() => onClear()}><i className="fas fa-trash" data-uk-tooltip="title: Clear"></i></button>
                        </div>) : null}
                    </div>
                </div>
            </div>
        )
    }
}

interface MultiUploadPanelProps {
    onFilesSelected: (files: File[]) => void;
    onFilesCleared: () => void;
    files: File[];
}

export class MultiUploadPanel extends React.Component<MultiUploadPanelProps, {}> {
    onFilesChosen(e: any){
        // can't run .map() on a FileList despite it being enumerable, so convert to array
        var files = [];
        for (let index = 0; index < e.target.files.length; index++) {
            const file = e.target.files[index];
            files.push(file);
        }

        this.props.onFilesSelected(files);
    }

    clearFiles(){
        this.props.onFilesCleared();
    }

    render() {
        var files = this.props.files;
        if(files == null || files.length == 0) {
            return (
                <div className="uk-flex uk-flex-center uk-form-custom file-upload-pane">
                    <input type="file" onChange={(e:any) => this.onFilesChosen(e)} multiple />
                    <p><i className="fas fa-mouse-pointer uk-margin-small-right"></i><strong>Choose multiple files</strong>, or drag them here.</p>
                </div>);
        }
        
        var fileViews = files.map((f, index) => {
            return (<FileView file={f} bottomMargin />)
        });

        return (
            <div>
                <div className="uk-flex uk-flex-right uk-margin-small-bottom">
                    <button className='uk-button uk-button-default uk-button-small' onClick={() => this.clearFiles()}><i className="fas fa-trash uk-margin-small-right" data-uk-tooltip="title: Clear"></i>Clear</button>
                </div>
                <div className="uk-height-max-medium" style={{overflow: 'auto', padding: '0px 10px'}}>
                    {fileViews}
                </div>
            </div>
        );
    }
}


interface UploadPanelProps {
    onFileSelected: (file: File) => void;
    onFileCleared: () => void;
    file: File;
}

export class UploadPanel extends React.Component<UploadPanelProps, {}> {
    onFileChosen(e: any){
        var file = e.target.files[0];
        this.props.onFileSelected(file);
    }

    clearFile(){
        this.props.onFileCleared();
    }

    render() {
        var file = this.props.file;
        if(file == null) {
            return (
                <div className="uk-flex uk-flex-center uk-form-custom file-upload-pane">
                    <input type="file" onChange={(e:any) => this.onFileChosen(e)} />
                    <p><i className="fas fa-mouse-pointer uk-margin-small-right"></i><strong>Choose a file</strong>, or drag it here.</p>
                </div>);
        }

        return <FileView file={file} showClear={true} onClear={() => this.clearFile()} />
    }
}