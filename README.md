
## Getting started

#### Step 1: Install ng-bootstrap

- [ng-bootstrap](https://ng-bootstrap.github.io/#/getting-started)
```bash
   ng add @ng-bootstrap/ng-bootstrap
```

#### Step 2: Install ngx-photo-editor
    
```bash
    npm install ngx-photo-editor --save
```
#### Step 3: Add `bootstrap` file paths in your `.angular.json`
      
```json
}
       "styles": [
         "node_modules/bootstrap/dist/css/bootstrap.min.css"
       ]
}
```

## Example usage:
Add the NgxPhotoEditorModule to the imports of the module.
```js
      import {NgxImageEditorModule} from "ngx-image-editor";

      @NgModule({
        imports: [
          NgxPhotoEditorModule
        ]
      })
```

Add the element to your HTML:
```html

<div><input type="file" (change)="fileChangeEvent($event)"/></div>

<ngx-photo-editor
  [imageChanedEvent]="imageChangedEvent"
  (imageCropped)="imageCropped($event)"
  [aspectRatio]="4/3"
  [viewMode]="3"
  [resizeToWidth]="500"></ngx-photo-editor>

<img [src]="base64" alt="">

```

And add this to your ts file:
```js

import {CroppedEvent} from 'ngx-photo-editor';

export class AppComponent {
  imageChangedEvent: any;
  base64: any;
  
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: CroppedEvent) {
    this.base64 = event.base64;
  }
}

```

When you choose a file from the file input, it will trigger `fileChangeEvent`.
That event is then passed to the ngxPhotoEditor through `imageChangedEvent` which will load the image into the cropper.
Everytime you release the mouse, the `imageCropped` event will be triggerd with the cropped image as a Base64, Blob in its payload.

## API
All inputs are optional. Either the `imageChangedEvent`, `imageBase64` or `imageFile` or `imageUrl` should be set to load an image into the cropper.

## Inputs
|  Name                      | Type      | Default      | Description     |
| -------------------------- |---------- | ------------ | --------------- |
| `imageChangedEvent`        | FileEvent |              | The change event from your file input |
| `imageFile`                | Blob(File)|              | The file you want to change |
| `imageBase64`              | string    |              | If you don't want to use a file input, you can set a base64 image directly and it will be loaded into the cropper |
| `imageURL`                 | string    |              | If you don't want to use a file input or a base64 you can set an URL to get the image from. If requesting an image from a different domain make sure Cross-Origin Resource Sharing (CORS) is allowed or the image will fail to load. |
| `format`                   | string    | png          | Output format (png, jpeg, webp, bmp, ico) (not all browsers support all types, png is always supported, others are optional) |
| `aspectRatio`              | number    | 1 / 1        | The width / height ratio (e.g. 1 / 1 for a square, 4 / 3, 16 / 9 ...) |
| `resizeToWidth`            | number    | 0 (disabled) | Cropped image will be resized to this width (in px) |
| `resizeToHeight`           | number    | 0 (disabled) | Cropped image will be resized to this height (in px) (will be ignored if resizeToWidth is set)  |
| `roundCropper`             | boolean   | false        | Set this to true for a round cropper. Resulting image will still be square, use `border-radius: 100%` on resulting image to show it as round. |
| `imageQuality`             | number    | 92           | This only applies when using jpeg or webp as output format. Entering a number between 0 and 100 will determine the quality of the output image. |
| `autoCrop`                 | boolean   | true         | Enable to crop the image automatically when initialized. |
| `autoCropArea`             | number    | 1 (80% of the image)| A number between 0 and 1. Define the automatic cropping area size (percentage). |
| `mask`                     | boolean   | true         | Show the black modal above the image and under the crop box. |
| `guides`                   | boolean   | true         | Show the dashed lines above the crop box. |
| `centerIndicator`          | boolean   | true         | Show the center indicator above the crop box. |
| `canvasHeight`             | number    | 400          | Cropper canvas height. |
| `scalable`                 | boolean   | true         | Enable to scale the image. |
| `zoomable`                 | boolean   | true         | Enable to zoom the image. |
| `cropBoxMovable`           | boolean   | true         | Enable to move the crop box by dragging. |
| `cropBoxResizable`         | boolean   | true         | Enable to resize the crop box by dragging. |
| `modalSize`                | string    | null         | Modal Size. ('sm' / 'lg' / 'xl') |
| `modalCentered`            | boolean   | false        | Modal Position Centered. |
| `darkTheme`                | boolean   | true         | Enable Dark Theme. |
| `imageSmoothingEnabled`    | boolean   | true         | Smooth image output. |
| `imageSmoothingQuality`    | string    | low         | quality of image smoothing, one of "low" or "medium", or "high". |

## Outputs

| Name                    | Type              | Description |
| ----------------------- | ----------------- | ----------- |
| `imageCropped`          | ImageCroppedEvent | Emits an ImageCroppedEvent each time the image is cropped |
| `loadImageFailed`       | void              | Emits when a wrong file type was selected |

## Interfaces
#### ImageCroppedEvent
| Property              | Type            | Description |
| --------------------  | ------          | ----------- |
| base64                | string          | Base64 string of the cropped image |
| file                  | file(Blob)      | Blob(File) of the cropped image |
