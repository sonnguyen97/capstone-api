module.exports = {
  OPEN: {
    id: "c926c301-09f1-4dcb-8860-87217fb53430",
    name: "Tracking an Opened Email",
    searchStr: `<img id="emm-opened-email-tracking" src="/" style="display:none"/>`
  },
  CLICK: {
    id: "f967b6b8-e593-4251-865d-4b10cc07eb13",
    name: "Tracking a Clicked Component",
    searchStr: `<a href="/emm-clicked-email-tracking"`
  },
  UNSUBSCRIBE: {
    id: "b123a254-0b2c-404d-a0dd-2cc78c19945b",
    name: "Tracking unsubscribe click",
    searchStr1: `<a href="/emm-unsubscribe">Unsubscribe me</a> now!`,
    searchStr2: `Do not want to get any updates from us?`
  }
};

//  BACKUP CODE -- DO NOT DELETE THIS
/*
c926c301-09f1-4dcb-8860-87217fb53430 -- OPEN
f967b6b8-e593-4251-865d-4b10cc07eb13 -- CLICK
b123a254-0b2c-404d-a0dd-2cc78c19945b -- UNSUBSCRIBE
*/
