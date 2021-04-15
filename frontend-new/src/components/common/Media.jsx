import React, { Component } from 'react';

class Media extends Component {
    
    renderImage(src, attr) {
        return <img src={src} {...attr} />;
    }

    renderVideo(src, attr) {
        return <video src={src} controls {...attr} />;
    }

    renderAudio(src, attr){
        return <audio src={src} controls {...attr} />;
    }
    renderMedia(type, src, attr) {
        let media = null;

        switch (type) {
            case 'image':
            case 'gif':
                media = this.renderImage(src, attr);
                break;
            case 'video':
                media = this.renderVideo(src, attr);
                break;
            case 'audio':
                media = this.renderAudio(src, attr);
                break;
            default:
                break;
        }

        return media;
    }

    render() {
        const { type, src, ...attr } = this.props;
 
        return this.renderMedia(type, src, attr);
    }
}
 
export default Media;
