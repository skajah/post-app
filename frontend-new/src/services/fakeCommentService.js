import _ from 'lodash';

const names = [
  'Abby Thomas',
  'Brian Lucas',
  'Cathy Smith',
  'Deborah Gilford',
  'Evan James',
];

const comments = _.range(3).map((id) => {
  return {
    _id: id,
    username: names[id],
    date: new Date(),
    likes: Math.floor(Math.random() * 10),
    text:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure praesentium animi ipsum distinctio quidem quia ex numquam assumenda harum accusamus',
  };
});

export function getComments() {
  return comments;
}
