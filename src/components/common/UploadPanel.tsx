import * as React from "react";

interface UploadPanelProps {
    onFileSelected: (file: File) => void;
    onFileCleared: () => void;
    file: File;
}

export class UploadPanel extends React.Component<UploadPanelProps, {}> {
    onFileChosen(e: any){
        // TODO: Extend this component to allow for multi-file upload?
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
            <div>
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
                        <div className="uk-width-auto uk-flex uk-flex-middle">
                            <button className='uk-button uk-button-default uk-button-small' onClick={() => this.clearFile()}><i className="fas fa-trash" data-uk-tooltip="title: Clear"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}