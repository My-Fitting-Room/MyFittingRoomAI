import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "MyFittingRoomAI"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  // Handle Universal Links
  override func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    if userActivity.activityType == NSUserActivityTypeBrowsingWeb, let url = userActivity.webpageURL {
      print("UNIVERSAL LINK OPENED: \(url.absoluteString)")
      
      // Store link data in UserDefaults for React Native to access
      if let components = URLComponents(url: url, resolvingAgainstBaseURL: true),
         let queryItems = components.queryItems {
        if let referrerId = queryItems.first(where: { $0.name == "referrer" })?.value {
          print("REFERRER ID: \(referrerId)")
          UserDefaults.standard.set(referrerId, forKey: "app_referrer")
          UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: "referral_timestamp")
        }
      }
      
      // Post notification that React Native can listen for
      NotificationCenter.default.post(
        name: NSNotification.Name("RCTOpenURLNotification"), 
        object: nil, 
        userInfo: ["url": url.absoluteString]
      )
    }
    
    return super.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }
  
  // Handle URL scheme links (like myapp://)
  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    print("APP OPENED VIA URL SCHEME: \(url.absoluteString)")
    
    // Post notification that React Native can listen for
    NotificationCenter.default.post(
      name: NSNotification.Name("RCTOpenURLNotification"), 
      object: nil, 
      userInfo: ["url": url.absoluteString]
    )
    
    return super.application(app, open: url, options: options)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}