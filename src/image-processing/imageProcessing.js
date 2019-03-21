
import { maxImageWidth } from "../constants";
import ExifReader from "exifreader";

export const resizeImage = async (image, storeImageFunction) => {
    const fileName = image.name;

    const exifDataReader = new FileReader();

    exifDataReader.readAsArrayBuffer(image.slice(0, 128 * 1024));
    exifDataReader.onload = event => {
      let exifData;
      try {
        exifData = ExifReader.load(event.target.result);
      } catch (e) {
        //do nothing
      } finally {
        const reader = new FileReader();
        reader.readAsDataURL(image);

        reader.onload = async event => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            let width;
            let height;
            if (img.width <= maxImageWidth) {
              width = img.width;
              height = img.height;
            } else {
              width = maxImageWidth;
              height = img.height * (width / img.width);
            }

            if (exifData && exifData.Orientation) {
              const oldWidth = width;

              if (exifData.Orientation)
                switch (exifData.Orientation.value) {
                  case 6:
                    width = height;
                    height = oldWidth;
                    break;
                  case 8:
                    width = height;
                    height = oldWidth;
                    break;
                  default:
                    break;
                }
            }

            const elem = document.createElement("canvas");
            elem.width = width;
            elem.height = height;
            const ctx = elem.getContext("2d");

            if (exifData && exifData.Orientation) {
              //What to do?
              // 1 do nothing
              // 3 flip 180
              // 6 90 clockwise
              // 8 90 counterclockwise

              switch (exifData.Orientation.value) {
                case 3:
                  ctx.translate(width / 2, height / 2);
                  ctx.rotate(Math.PI);
                  ctx.drawImage(img, -width / 2, -height / 2, width, height);
                  break;
                case 6:
                  ctx.translate(width / 2, height / 2);
                  ctx.rotate((90 / 180) * Math.PI);
                  ctx.drawImage(img, -height / 2, -width / 2, height, width);
                  break;
                case 8:
                  ctx.translate(width / 2, height / 2);
                  ctx.rotate((-90 / 180) * Math.PI);
                  ctx.drawImage(img, -height / 2, -width / 2, height, width);
                  break;
                default:
                  ctx.drawImage(img, 0, 0, width, height);
                  break;
              }
            } else {
              ctx.drawImage(img, 0, 0, width, height);
            }

            const imageUrl = ctx.canvas.toDataURL();
            ctx.canvas.toBlob(
              blob => {
                const resizedImage = new File([blob], fileName, {
                  type: "image/jpeg",
                  lastModified: Date.now()
                });
                storeImageFunction(resizedImage, imageUrl);
              },
              "image/jpeg",
              1
            );
          };
        };
      }
    };
  };