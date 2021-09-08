/* exported data */
let data = {
  view: '',
  pastId: 1,
  myID: 0,
  pastWords: [],
  myWords: []
};

var previousData = localStorage.getItem('ajax-local-storage');
if (previousData !== null) {
  data = JSON.parse(previousData);
}

window.addEventListener('beforeunload', function () {
  localStorage.setItem('ajax-local-storage', JSON.stringify(data));
});
