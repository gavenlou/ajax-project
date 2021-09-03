/* exported data */
let data = {
  view: '',
  pastId: 0,
  pastWords: []
};

var previousData = localStorage.getItem('javascript-local-storage');
if (previousData !== null) {
  data = JSON.parse(previousData);
}

window.addEventListener('beforeunload', function () {
  localStorage.setItem('javascript-local-storage', JSON.stringify(data));
});
