import * as React from "react";
import * as cn from "classnames";
import { Card, CardBody, Row, Col, Button } from "reactstrap";

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
            case ".zip":
                iconClass = "file-archive";
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
            <Card className={cn("border", { "mb-1" : bottomMargin})}>
                <CardBody style={{padding: "1rem"}}>
                    <Row noGutters className="align-items-center flex-nowrap justify-content-between">
                        <i className={`fas fa-${iconClass} fa-lg`}></i>
                        {/* See: https://css-tricks.com/flexbox-truncated-text/ */}
                        <div className="pl-2" style={{minWidth: '0'}}>
                            <h6 className="m-0 text-truncate">{name}</h6>
                        </div>
                        <p className="text-lightweight px-1 m-0 text-nowrap text-align-right">{size}</p>
                        { showClear && (
                            <Button color="danger" outline className="btn-grey-outline ml-1" size="sm" onClick={() => onClear()}>
                                <i className="material-icons">delete</i>
                            </Button>)}
                    </Row>
                </CardBody>
            </Card>);
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
                <div className="tf-custom-file-input file-upload-pane p-3 d-flex align-items-center position-relative h-100 w-100">
                    <input type="file" onChange={(e:any) => this.onFilesChosen(e)} multiple />
                    <p className="w-100 m-0 text-center"><i className="fas fa-mouse-pointer mr-2"></i><strong>Choose multiple files</strong>, or drag them here.</p>
                </div>);
        }
        
        var fileViews = files.map((f, index) => {
            return (<FileView key={index} file={f} bottomMargin />)
        });

        return (
            <div>
                <div className="mb-1 d-flex justify-content-end">
                    <Button color="danger" outline className="btn-grey-outline ml-2" size="sm" onClick={() => this.clearFiles()}>
                        <i className="material-icons">delete</i>
                        Clear
                    </Button>
                </div>
                <div className="px-2" style={{overflow: 'auto', maxHeight: '300px'}}>
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
                <div className="tf-custom-file-input file-upload-pane p-3 d-flex align-items-center position-relative h-100 w-100">
                    <input type="file" onChange={(e:any) => this.onFileChosen(e)} />
                    <p className="w-100 m-0 text-center"><i className="fas fa-mouse-pointer mr-2"></i><strong>Choose a file</strong>, or drag it here.</p>
                </div>);
        }

        return <FileView file={file} showClear={true} onClear={() => this.clearFile()} />
    }
}