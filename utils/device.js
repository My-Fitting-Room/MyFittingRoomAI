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

  return "unknown";
}