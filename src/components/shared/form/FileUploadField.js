import React from 'react';

export class FileUploadField extends React.Component {

    constructor() {
        super();

        this.createFileReader();

        this.onChange = this.onChange.bind(this);
        this.state = {
            selectedFile: {},
            imageBase64: ''
        }
    }

    createFileReader = () => {
        this.reader = new FileReader();
        this.reader.addEventListener('load', (event) => {
            const {input: {onChange}} = this.props;
            this.setState({
                imageBase64: event.target.result
            });
            onChange(event.target.result);
        });
    }

    onChange(event) {
        const {input: {onChange}} = this.props;
        console.log(event.target.files);
        const selectedFile = event.target.files[0];
        
        if(selectedFile){
            this.setState({
                selectedFile
            });
            this.reader.readAsDataURL(selectedFile);
        }
        //onChange('https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg');
    }

    render() {
        const { label, meta: {touched, error}} = this.props;
        return (
            <div className='form-group'>
                <label>{label}</label>
                <div className='inputGroup'>
                    <input type='file' multiple
                        accept='.jpg, .png, .jpeg'
                        onChange={this.onChange} />
                </div>
                {touched &&
                    ((error && <div className='alert alert-danger'>{error}</div>))
                }
            </div>
        )
    }
}