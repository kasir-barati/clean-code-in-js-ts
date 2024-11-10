enum MoodStatus {
  happy = 'happy',
  normal = 'normal',
  sad = 'sad',
  angry = 'angry',
}

const myMood = {
  currentStatus: MoodStatus.happy,
  previousStatus: MoodStatus.normal,
};

Object.defineProperty(myMood, 'changeIt', {
  value: function (status: MoodStatus) {
    this.previousStatus = this.currentStatus;
    this.currentStatus = status;
  },
  writable: false, // this will prevent any value change from the outside of the object
  enumerable: false, // to hide this property when the user use Object.keys(myMood)
  configurable: false, // disable redefining properties. User cannot use Object.defineProperty(myMood, 'changeIt', { ... })
});
