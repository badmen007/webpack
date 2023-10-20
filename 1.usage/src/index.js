
import responsiveImage from "./images/jpg.jpg?sizes[]=300,sizes[]=600,sizes[]=1024";

const img = new Image()
img.srcset = responsiveImage.srcSet;
img.sizes = `(min-width: 1024) 1024px, 100vw`
document.body.appendChild(img)