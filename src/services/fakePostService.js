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
      'https://vod-progressive.akamaized.net/exp=1611348493~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F1826%2F16%2F409130897%2F1754500252.mp4~hmac=883ecd0797156bebbb77cab605e726b41aabc91303589a00a776c8ac1ac766b8/vimeo-prod-skyfire-std-us/01/1826/16/409130897/1754500252.mp4?filename=production+ID%3A4182916.mp4',
    controls: true,
  },
  {
    type: 'audio',
    src: 'https://www.computerhope.com/jargon/m/example.mp3',
    controls: true,
  },
  null,
];

const dates = [
  new Date(),
  new Date('01/29/2021'),
  new Date('01/24/2021'),
  new Date('12/31/2020'),
];

const posts = _.range(4).map((id) => {
  return {
    _id: id,
    username: names[id],
    date: dates[id],
    likes: Math.floor(Math.random() * 10),
    text: 'Recusandae nostrum quod accusantium temporibus accusamus.',
    media: medias[id],
    comments: getComments(),
  };
});

export function getPosts() {
  return posts;
}
