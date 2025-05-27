export const getDeviceGroup = (width, height) => {
    
  if (width === 414 && height === 736) {
    return "group1"; 
  }
  
  if (width === 375 && height === 667) {
    return "group2"; 
  }
  
  if (width === 375 && height === 812) {
    return "group3"; 
  }
  
  if (width === 390 && height === 844) {
    return "group4"; 
  }
  
  if (width === 393 && height === 852) {
    return "group5"; 
  }
  
  if (width === 414 && height === 896) {
    return "group6"; 
  }
  
  if (width === 402 && height === 874) {
    return "group7"; 
  }
  
  if (width === 428 && height === 926) {
    return "group8"; 
  }
  
  if (width === 430 && height === 932) {
    return "group9"; 
  }
  
  if (width === 440 && height === 956) {
    return "group10"; 
  }
  
    // iPhone 8 Plus - 414×736 (304,704 pixels)
    // iPhone SE (3rd gen) - 375×667 (250,125 pixels)
    // iPhone 13 mini - 375×812 (304,500 pixels)
    // iPhone 13 Pro - 390×844 (329,160 pixels)
    // iPhone 16 - 393×852 (334,836 pixels)
    // iPhone 11/XR - 414×896 (370,944 pixels)
    // iPhone 16 Pro - 402×874 (351,348 pixels)
    // iPhone 13 Pro Max - 428×926 (396,328 pixels)
    // iPhone 16 Plus - 430×932 (400,760 pixels)
    // iPhone 16 Pro Max - 440×956 (420,640 pixels)


  return "unknown";
}






// console.log(width, height)
//   const aspectRatio = height / width;
//   const screenArea = width * height;
//   let deviceType = "compact";

//   // iPhone SE (3rd gen) DONE
//   if ((width <= 375 && height <= 667) || (width <= 320 && height <= 568)) {
//     deviceType =  "compact";
//   }

//   // 
//   if (width <= 375 && height >= 800 && height <= 820) {
//     deviceType =  "mini";
//   }

  

//   // iphone 11 pro ,iphone 12 , iphone13, , iphone 13 mini
//   if (width >= 375 && width < 393 && height >= 800 && height <= 860) {
//     deviceType =  "standard";
//   }

//   //iphone 16, iphone 15
//   if (width === 393 && height === 852) {
//     deviceType =  "large";
//   }

//   // iphone 11, iphone 14 plus , iphone 15 pro max
//   if (width >= 410 && width <= 430 && height >= 890) {
//     deviceType =  "large";
//   }

//   // iphone 16 pro max 440×956 , ??iPhone 16 Pro 402×874, ??iPhone 16 Plus 430×932
//   if (width > 430 || height > 932) {
//     deviceType =  "extraLarge";
//   }

//   //make new one for iphone 15 and 16

//   console.log('before screen area',deviceType)

 
   