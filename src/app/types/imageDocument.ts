export class ImageDocument {
  id: string;
  uid: string;
  postProcess = {
    tiles: false,
    thumbnail: false
  };

  constructor(id: string, uid: string) {
    this.id = id;
    this.uid = uid;
  }

}
