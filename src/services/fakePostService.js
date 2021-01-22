import { getComments } from './fakeCommentService';
import _ from 'lodash';

const names = ['Kevin Hither', 'Mandy Brown', 'William Roscoe', 'Thomas Green'];

const medias = [
  {
    type: 'image',
    src:
      'https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg',
  },
  {
    type: 'video',
    src:
      'https://vod-progressive.akamaized.net/exp=1611285299~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F1930%2F13%2F334654600%2F1322028013.mp4~hmac=126f0c1c62c6b5de9fbecbd199dcc336ae537f88d3801a4d874a80af6c083589/vimeo-prod-skyfire-std-us/01/1930/13/334654600/1322028013.mp4?filename=Pexels+Videos+2284984.mp4',
    controls: true,
  },
  {
    type: 'audio',
    src: 'https://www.computerhope.com/jargon/m/example.mp3',
    controls: true,
  },
  null,
];

const posts = _.range(4).map((id) => {
  return {
    _id: id,
    username: names[id],
    date: new Date(),
    likes: Math.floor(Math.random() * 10),
    text: 'Recusandae nostrum quod accusantium temporibus accusamus.',
    media: medias[id],
    comments: getComments(),
  };
});

export function getPosts() {
  return posts;
}
