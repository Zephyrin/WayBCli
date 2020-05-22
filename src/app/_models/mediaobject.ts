import { environment } from '@environments/environment';
import { SafeResourceUrl } from '@angular/platform-browser';

export class Mediaobject {
  id: number;
  description: string;
  filePath: string;
  private _image: SafeResourceUrl;
  get image(): SafeResourceUrl {
    return this._image;
  }
  set image(image: SafeResourceUrl) {
    this._image = image;
    this.timeStamp = (new Date()).getTime();
  }
  timeStamp: number;

  constructor(mediaobject: Mediaobject = null) {
    if (mediaobject !== null && mediaobject !== undefined) {
      this.id = mediaobject.id;
      this.description = mediaobject.description;
      this.filePath = mediaobject.filePath;
      this.image = mediaobject.image;
      this.timeStamp = mediaobject.timeStamp;
    } else {
      this.timeStamp = (new Date()).getTime();
    }
  }

  public url(): string {
    if (this.timeStamp) {
      return `${environment.mediaUrl}/${this.filePath}` + '?' + this.timeStamp;
    }
    return `${environment.mediaUrl}/${this.filePath}`;
  }

  public hasUrl(): boolean {
    return this.filePath !== undefined;
  }

  public update(mediaobject: Mediaobject) {
    if (mediaobject !== null && mediaobject !== undefined) {
      this.id = mediaobject.id;
      this.description = mediaobject.description;
      this.filePath = mediaobject.filePath;
      this.image = mediaobject.image;
      this.timeStamp = (new Date()).getTime();
    } else {
      this.timeStamp = (new Date()).getTime();
    }
  }
}
