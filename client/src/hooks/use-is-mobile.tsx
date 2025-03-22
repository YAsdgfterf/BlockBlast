import * as React from "react"

export type DeviceType = 'pc' | 'tablet' | 'mobile';

export function useDeviceDetection() {
  const [deviceType, setDeviceType] = React.useState<DeviceType>('pc');

  React.useEffect(() => {
    const detectDevice = () => {
      // Detect if it's iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      // Detect if it's any mobile device through userAgent
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Check touch capabilities
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Detect iPad or tablet specifically
      const isTablet = isIOS && navigator.maxTouchPoints > 1 || 
                      (isMobile && Math.min(window.innerWidth, window.innerHeight) > 480);
      
      // Small mobile devices like phones
      const isSmallMobile = isMobile && !isTablet;
      
      // Set device type
      if (isTablet) {
        setDeviceType('tablet');
      } else if (isSmallMobile) {
        setDeviceType('mobile');
      } else {
        setDeviceType('pc');
      }
      
      // Log for debugging
      console.log(`Device detected: ${isTablet ? 'Tablet' : (isSmallMobile ? 'Mobile' : 'PC')}`);
      console.log(`Touch enabled: ${hasTouch ? 'Yes' : 'No'}`);
    };

    // Detect on initial load
    detectDevice();
    
    // Re-detect on window resize
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  return {
    deviceType,
    isPC: deviceType === 'pc',
    isTablet: deviceType === 'tablet',
    isMobile: deviceType === 'mobile',
    isTouchDevice: deviceType === 'tablet' || deviceType === 'mobile'
  };
}

// Keeping this for backward compatibility
export function useIsMobile() {
  const { isTouchDevice } = useDeviceDetection();
  return isTouchDevice;
}
