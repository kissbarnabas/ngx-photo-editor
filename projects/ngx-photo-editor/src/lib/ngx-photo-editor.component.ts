import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  Renderer2,
  OnInit,
  ViewContainerRef,
  TemplateRef,
  AfterViewInit,
  ViewRef,
} from "@angular/core";
import Cropper from "cropperjs";
import ViewMode = Cropper.ViewMode;
import Swal from "sweetalert2";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "ngx-photo-editor",
  templateUrl: "./ngx-photo-editor.component.html",
  styleUrls: ["./ngx-photo-editor.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class NgxPhotoEditorComponent implements OnInit, AfterViewInit {
  @ViewChild("editor", { static: false })
  content: ElementRef;

  @ViewChild("vc", { read: ViewContainerRef, static: false })
  vc: ViewContainerRef;
  @ViewChild("tpl", { read: TemplateRef, static: false }) tpl: TemplateRef<any>;

  childRefView: ViewRef;

  isOpen = false;

  public cropper: Cropper;
  public outputImage: string;
  prevZoom = 0;
  showDiv = false;

  @Input() modalTitle = "Photo Editor";
  @Input() aspectRatio = 1;
  @Input() autoCropArea = 1;
  @Input() autoCrop = true;
  @Input() mask = true;
  @Input() guides = true;
  @Input() centerIndicator = true;
  @Input() viewMode: ViewMode = 0;
  @Input() modalSize: size;
  @Input() modalCentered = false;
  @Input() scalable = true;
  @Input() zoomable = true;
  @Input() cropBoxMovable = true;
  @Input() cropBoxResizable = true;
  @Input() darkTheme = true;
  @Input() roundCropper = false;
  @Input() canvasHeight = 100;
  @Input() canvasWidth = 100;

  @Input() resizeToWidth: number;
  @Input() resizeToHeight: number;
  @Input() imageSmoothingEnabled = true;
  @Input() imageSmoothingQuality: ImageSmoothingQuality = "high";
  @Input() fillColor = "rgba(255, 255, 255, 0)";
  @Input() textureWidth = 1000;
  @Input() textureHeight = 1000;
  url: string;
  lastUpdate = Date.now();

  format = "png";
  quality = 100;

  isFormatDefined = false;

  @Output() imageCropped = new EventEmitter<CroppedEvent>();

  constructor(private renderer: Renderer2) {}
  ngAfterViewInit(): void {
    this.childRefView = this.tpl.createEmbeddedView(null);
  }

  insertChildView(): void {
    this.vc.insert(this.childRefView);
  }

  removeChildView(): void {
    this.vc.detach();
  }

  ngOnInit(): void {}

  @Input() set imageQuality(value: number) {
    if (value > 0 && value <= 100) {
      this.quality = value;
    }
  }

  @Input() set imageFormat(type: imageFormat) {
    if (/^(gif|jpe?g|tiff|png|webp|bmp)$/i.test(type)) {
      this.format = type;
      this.isFormatDefined = true;
    }
  }

  @Input() set imageUrl(url: string) {
    if (url) {
      this.url = url;
      if (this.lastUpdate !== Date.now()) {
        this.open();
        this.lastUpdate = Date.now();
      }
    }
  }

  @Input() set imageBase64(base64: string) {
    if (base64 && /^data:image\/([a-zA-Z]*);base64,([^\"]*)$/.test(base64)) {
      this.imageUrl = base64;
      if (!this.isFormatDefined) {
        this.format = base64
          .split(",")[0]
          .split(";")[0]
          .split(":")[1]
          .split("/")[1];
      }
    }
  }

  @Input() set imageChanedEvent(event: any) {
    if (event) {
      const file = event.target.files[0];
      if (file && /\.(gif|jpe?g|tiff|png|webp|bmp)$/i.test(file.name)) {
        if (!this.isFormatDefined) {
          this.format = event.target.files[0].type.split("/")[1];
        }
        const reader = new FileReader();
        reader.onload = (ev: any) => {
          this.imageUrl = ev.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  @Input() set imageFile(file: File) {
    if (file && /\.(gif|jpe?g|tiff|png|webp|bmp)$/i.test(file.name)) {
      if (!this.isFormatDefined) {
        this.format = file.type.split("/")[1];
      }
      const reader = new FileReader();
      reader.onload = (ev: any) => {
        this.imageUrl = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageLoad(image: HTMLImageElement) {
    image.addEventListener("ready", () => {
      if (this.roundCropper) {
        (document.getElementsByClassName(
          "cropper-view-box"
        )[0] as HTMLElement).style.borderRadius = "50%";
        (document.getElementsByClassName(
          "cropper-face"
        )[0] as HTMLElement).style.borderRadius = "50%";
      }
    });

    this.cropper = new Cropper(image, {
      aspectRatio: this.aspectRatio,
      autoCropArea: this.autoCropArea,
      autoCrop: this.autoCrop,
      modal: this.mask, // black mask
      guides: this.guides, // grid
      center: this.centerIndicator, // center indicator
      viewMode: this.viewMode,
      scalable: this.scalable,
      zoomable: this.zoomable,
      cropBoxMovable: this.cropBoxMovable,
      cropBoxResizable: this.cropBoxResizable,
    });

    this.removeChildView();
    this.insertChildView();

    // console.log(this.cropper);
    console.log(image);
  }

  rotateRight() {
    this.cropper.rotate(45);
  }

  rotateLeft() {
    this.cropper.rotate(-45);
  }

  crop() {
    this.cropper.setDragMode("crop");
  }

  move() {
    this.cropper.setDragMode("move");
  }

  zoom(event) {
    const value = Number(event.target.value);
    this.cropper.zoom(value - this.prevZoom);
    this.prevZoom = value;
  }

  zoomIn() {
    this.cropper.zoom(0.1);
  }

  zoomOut() {
    this.cropper.zoom(-0.1);
  }

  flipH() {
    this.cropper.scaleX(-this.cropper.getImageData().scaleX);
  }

  flipV() {
    this.cropper.scaleY(-this.cropper.getImageData().scaleY);
  }

  reset() {
    this.cropper.reset();
  }

  export() {
    let cropedImage;
    if (this.resizeToWidth && this.resizeToHeight) {
      cropedImage = this.cropper.getCroppedCanvas({
        width: this.resizeToWidth,
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality,
      });
    } else if (this.resizeToHeight) {
      cropedImage = this.cropper.getCroppedCanvas({
        height: this.resizeToHeight,
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality,
      });
    } else if (this.resizeToWidth) {
      cropedImage = this.cropper.getCroppedCanvas({
        width: this.resizeToWidth,
        fillColor: this.fillColor,
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality,
      });
    } else {
      cropedImage = this.cropper.getCroppedCanvas({
        imageSmoothingEnabled: this.imageSmoothingEnabled,
        imageSmoothingQuality: this.imageSmoothingQuality,
      });
    }

    var myImage = new Image(
      (cropedImage as HTMLCanvasElement).width,
      (cropedImage as HTMLCanvasElement).height
    );

    myImage.src = (cropedImage as HTMLCanvasElement).toDataURL(
      "image/" + this.format,
      this.quality
    );

    this.cropper.setAspectRatio(1);

    let canvas = document.createElement("canvas");

    canvas.width = this.textureWidth;
    canvas.height = this.textureHeight;

    let context = (canvas as HTMLCanvasElement).getContext("2d");
    context.fillStyle = this.fillColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      cropedImage,
      canvas.width / 2 - cropedImage.width / 2,
      canvas.height / 2 - cropedImage.height / 2
    );

    this.outputImage = canvas.toDataURL("image/" + this.format, this.quality);

    cropedImage.toBlob(
      (blob) => {
        this.imageCropped.emit({
          base64: this.outputImage,
          file: new File([blob], Date.now() + "." + this.format, {
            type: "image/" + this.format,
          }),
        });
      },
      "image/" + this.format,
      this.quality / 100
    );
  }

  open() {
    // this.renderer.setStyle(this.content.nativeElement, "visibility", "visible");
    this.childRefView = this.tpl.createEmbeddedView(null);

    this.removeChildView();
    this.insertChildView();

    console.log(this.content);

    Swal.fire({
      width: this.canvasWidth + 100,
      html: this.content.nativeElement,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonColor: "#4200ff",
      confirmButtonText: "Mentés",
      cancelButtonText: "Mégsem",
    }).then((result) => {
      if (result.isConfirmed) {
        this.export();
        Swal.fire("Elmentve!", "", "success");
      }
    });
  }
}

export interface CroppedEvent {
  base64?: string;
  file?: File;
}

export type imageFormat = "gif" | "jpeg" | "tiff" | "png" | "webp" | "bmp";

export type size = "sm" | "lg" | "xl" | string;
