import _ from 'lodash';

const names = [
  'Abby Thomas',
  'Brian Lucas',
  'Cathy Smith',
  'Deborah Gilford',
  'Evan James',
];

const comments = _.range(5).map((id) => {
  return {
    _id: id,
    username: names[id],
    date: new Date(),
    text:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure praesentium animi ipsum distinctio quidem quia ex numquam assumenda harum accusamus',
  };
});

export function getComments() {
  return comments;
}
