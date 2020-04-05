export class Challenge {
  id: string;
  uid: string;
  postProcess = {
    tiles: false,
    thumbnail: false
  };
  description = '';
  photoCredit = '';
  photoCreditUrl = '';

  constructor(id: string, uid: string) {
    this.id = id;
    this.uid = uid;
  }

}
