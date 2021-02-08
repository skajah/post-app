import React from 'react';
import { FilePicker } from 'react-file-picker';

function withFileChooser(Component) {
    return class WithFileChooser extends React.Component {

        getFileData(file) {
            return URL.createObjectURL(file);
        }
        render() {
            const { extensions, maxFileSize, onFileChosen, ...rest } = this.props; 
            return (
            <div>
                <FilePicker 
                extensions={extensions}
                maxSize={maxFileSize}
                onChange={file => onFileChosen(this.getFileData(file))}
                onError={msg => alert(msg)}>
                    <Component {...rest} />
                </FilePicker>
            </div>
            );
        }
    }
}

export default withFileChooser;