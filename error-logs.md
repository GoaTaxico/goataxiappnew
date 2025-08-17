[20:58:30.351] Running build in Washington, D.C., USA (East) – iad1
[20:58:30.358] Build machine configuration: 2 cores, 8 GB
[20:58:30.395] Retrieving list of deployment files...
[20:58:30.404] Skipping build cache, deployment was triggered without cache.
[20:58:30.910] Downloading 137 deployment files...
[20:58:33.446] Running "vercel build"
[20:58:33.831] Vercel CLI 45.0.10
[20:58:34.153] Installing dependencies...
[20:58:54.257] npm warn deprecated abab@2.0.6: Use your platform's native atob() and btoa() methods instead
[20:58:54.287] npm warn deprecated domexception@4.0.0: Use your platform's native DOMException instead
[20:58:55.667] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[20:58:56.412] npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
[20:58:56.576] npm warn deprecated glob@7.1.7: Glob versions prior to v9 are no longer supported
[20:58:57.458] npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
[20:58:57.550] npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
[20:58:57.551] npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
[20:58:57.585] npm warn deprecated @supabase/auth-helpers-react@0.4.2: This package is now deprecated - please use the @supabase/ssr package instead.
[20:58:58.107] npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
[20:59:00.494] npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
[20:59:13.086] 
[20:59:13.087] added 833 packages in 39s
[20:59:13.087] 
[20:59:13.087] 203 packages are looking for funding
[20:59:13.088]   run `npm fund` for details
[20:59:13.318] Detected Next.js version: 14.0.4
[20:59:13.326] Running "npm run build"
[20:59:13.549] 
[20:59:13.549] > goa-taxi-app@0.1.0 build
[20:59:13.549] > next build
[20:59:13.550] 
[20:59:14.237]  ⚠ Invalid next.config.js options detected: 
[20:59:14.238]  ⚠     Unrecognized key(s) in object: 'missingSuspenseWithCSRBailout' at "experimental"
[20:59:14.238]  ⚠     Unrecognized key(s) in object: 'generateStaticParams'
[20:59:14.238]  ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
[20:59:14.245] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[20:59:14.245] This information is used to shape Next.js' roadmap and prioritize features.
[20:59:14.246] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[20:59:14.246] https://nextjs.org/telemetry
[20:59:14.246] 
[20:59:14.327]    ▲ Next.js 14.0.4
[20:59:14.328]    - Environments: .env
[20:59:14.328] 
[20:59:14.328]    Creating an optimized production build ...
[20:59:35.094]  ✓ Compiled successfully
[20:59:35.095]    Linting and checking validity of types ...
[20:59:43.738] 
[20:59:43.739] ./app/admin/drivers/page.tsx
[20:59:43.739] 70:9  Warning: Unexpected console statement.  no-console
[20:59:43.740] 82:9  Warning: Unexpected console statement.  no-console
[20:59:43.740] 
[20:59:43.740] ./app/api/analytics/drivers/route.ts
[20:59:43.740] 64:7  Warning: Unexpected console statement.  no-console
[20:59:43.740] 79:7  Warning: Unexpected console statement.  no-console
[20:59:43.745] 91:7  Warning: Unexpected console statement.  no-console
[20:59:43.745] 158:7  Warning: Unexpected console statement.  no-console
[20:59:43.745] 234:5  Warning: Unexpected console statement.  no-console
[20:59:43.745] 
[20:59:43.746] ./app/api/analytics/revenue/route.ts
[20:59:43.746] 65:7  Warning: Unexpected console statement.  no-console
[20:59:43.746] 81:7  Warning: Unexpected console statement.  no-console
[20:59:43.746] 93:7  Warning: Unexpected console statement.  no-console
[20:59:43.747] 138:7  Warning: Unexpected console statement.  no-console
[20:59:43.747] 169:5  Warning: Unexpected console statement.  no-console
[20:59:43.747] 
[20:59:43.747] ./app/api/analytics/rides/route.ts
[20:59:43.747] 63:7  Warning: Unexpected console statement.  no-console
[20:59:43.749] 123:7  Warning: Unexpected console statement.  no-console
[20:59:43.749] 186:5  Warning: Unexpected console statement.  no-console
[20:59:43.749] 
[20:59:43.750] ./app/api/auth/reset-password/route.ts
[20:59:43.750] 34:7  Warning: Unexpected console statement.  no-console
[20:59:43.750] 47:5  Warning: Unexpected console statement.  no-console
[20:59:43.750] 
[20:59:43.750] ./app/api/auth/update-password/route.ts
[20:59:43.751] 40:7  Warning: Unexpected console statement.  no-console
[20:59:43.751] 53:5  Warning: Unexpected console statement.  no-console
[20:59:43.752] 
[20:59:43.752] ./app/api/bookings/[id]/assign-driver/route.ts
[20:59:43.752] 54:7  Warning: Unexpected console statement.  no-console
[20:59:43.754] 124:7  Warning: Unexpected console statement.  no-console
[20:59:43.756] 146:7  Warning: Unexpected console statement.  no-console
[20:59:43.756] 168:7  Warning: Unexpected console statement.  no-console
[20:59:43.757] 179:5  Warning: Unexpected console statement.  no-console
[20:59:43.757] 
[20:59:43.757] ./app/api/bookings/[id]/complete/route.ts
[20:59:43.757] 47:7  Warning: Unexpected console statement.  no-console
[20:59:43.757] 101:7  Warning: Unexpected console statement.  no-console
[20:59:43.758] 137:11  Warning: Unexpected console statement.  no-console
[20:59:43.758] 181:9  Warning: Unexpected console statement.  no-console
[20:59:43.759] 193:5  Warning: Unexpected console statement.  no-console
[20:59:43.766] 
[20:59:43.771] ./app/api/bookings/[id]/route.ts
[20:59:43.772] 37:7  Warning: Unexpected console statement.  no-console
[20:59:43.772] 77:5  Warning: Unexpected console statement.  no-console
[20:59:43.772] 121:7  Warning: Unexpected console statement.  no-console
[20:59:43.773] 182:7  Warning: Unexpected console statement.  no-console
[20:59:43.773] 196:5  Warning: Unexpected console statement.  no-console
[20:59:43.773] 228:7  Warning: Unexpected console statement.  no-console
[20:59:43.773] 275:7  Warning: Unexpected console statement.  no-console
[20:59:43.773] 288:5  Warning: Unexpected console statement.  no-console
[20:59:43.774] 
[20:59:43.774] ./app/api/bookings/route.ts
[20:59:43.774] 60:7  Warning: Unexpected console statement.  no-console
[20:59:43.774] 74:5  Warning: Unexpected console statement.  no-console
[20:59:43.774] 126:7  Warning: Unexpected console statement.  no-console
[20:59:43.775] 145:5  Warning: Unexpected console statement.  no-console
[20:59:43.775] 
[20:59:43.775] ./app/api/drivers/[id]/approve/route.ts
[20:59:43.778] 44:7  Warning: Unexpected console statement.  no-console
[20:59:43.778] 72:7  Warning: Unexpected console statement.  no-console
[20:59:43.778] 86:5  Warning: Unexpected console statement.  no-console
[20:59:43.778] 
[20:59:43.778] ./app/api/drivers/[id]/location/route.ts
[20:59:43.779] 70:7  Warning: Unexpected console statement.  no-console
[20:59:43.779] 118:7  Warning: Unexpected console statement.  no-console
[20:59:43.782] 136:7  Warning: Unexpected console statement.  no-console
[20:59:43.782] 156:5  Warning: Unexpected console statement.  no-console
[20:59:43.782] 
[20:59:43.783] ./app/api/drivers/[id]/reject/route.ts
[20:59:43.783] 47:7  Warning: Unexpected console statement.  no-console
[20:59:43.783] 75:7  Warning: Unexpected console statement.  no-console
[20:59:43.783] 98:7  Warning: Unexpected console statement.  no-console
[20:59:43.783] 109:5  Warning: Unexpected console statement.  no-console
[20:59:43.784] 
[20:59:43.791] ./app/api/drivers/[id]/rides/route.ts
[20:59:43.791] 52:7  Warning: Unexpected console statement.  no-console
[20:59:43.792] 105:7  Warning: Unexpected console statement.  no-console
[20:59:43.798] 140:5  Warning: Unexpected console statement.  no-console
[20:59:43.798] 
[20:59:43.799] ./app/api/drivers/[id]/route.ts
[20:59:43.799] 33:7  Warning: Unexpected console statement.  no-console
[20:59:43.799] 68:5  Warning: Unexpected console statement.  no-console
[20:59:43.799] 161:7  Warning: Unexpected console statement.  no-console
[20:59:43.806] 175:5  Warning: Unexpected console statement.  no-console
[20:59:43.806] 
[20:59:43.807] ./app/api/drivers/[id]/suspend/route.ts
[20:59:43.807] 47:7  Warning: Unexpected console statement.  no-console
[20:59:43.807] 88:7  Warning: Unexpected console statement.  no-console
[20:59:43.807] 112:7  Warning: Unexpected console statement.  no-console
[20:59:43.807] 124:5  Warning: Unexpected console statement.  no-console
[20:59:43.808] 
[20:59:43.808] ./app/api/drivers/nearby/route.ts
[20:59:43.808] 43:7  Warning: Unexpected console statement.  no-console
[20:59:43.808] 69:5  Warning: Unexpected console statement.  no-console
[20:59:43.808] 
[20:59:43.808] ./app/api/drivers/register/route.ts
[20:59:43.809] 64:7  Warning: Unexpected console statement.  no-console
[20:59:43.809] 95:7  Warning: Unexpected console statement.  no-console
[20:59:43.809] 117:7  Warning: Unexpected console statement.  no-console
[20:59:43.810] 135:7  Warning: Unexpected console statement.  no-console
[20:59:43.810] 146:5  Warning: Unexpected console statement.  no-console
[20:59:43.810] 
[20:59:43.811] ./app/api/drivers/route.ts
[20:59:43.811] 65:7  Warning: Unexpected console statement.  no-console
[20:59:43.811] 84:5  Warning: Unexpected console statement.  no-console
[20:59:43.811] 
[20:59:43.811] ./app/api/errors/route.ts
[20:59:43.811] 60:7  Warning: Unexpected console statement.  no-console
[20:59:43.812] 85:9  Warning: Unexpected console statement.  no-console
[20:59:43.812] 105:9  Warning: Unexpected console statement.  no-console
[20:59:43.812] 115:5  Warning: Unexpected console statement.  no-console
[20:59:43.812] 173:7  Warning: Unexpected console statement.  no-console
[20:59:43.812] 192:5  Warning: Unexpected console statement.  no-console
[20:59:43.813] 
[20:59:43.813] ./app/api/notifications/[id]/route.ts
[20:59:43.813] 34:7  Warning: Unexpected console statement.  no-console
[20:59:43.813] 41:5  Warning: Unexpected console statement.  no-console
[20:59:43.813] 73:7  Warning: Unexpected console statement.  no-console
[20:59:43.813] 99:7  Warning: Unexpected console statement.  no-console
[20:59:43.814] 113:5  Warning: Unexpected console statement.  no-console
[20:59:43.814] 145:7  Warning: Unexpected console statement.  no-console
[20:59:43.814] 167:7  Warning: Unexpected console statement.  no-console
[20:59:43.815] 180:5  Warning: Unexpected console statement.  no-console
[20:59:43.815] 
[20:59:43.816] ./app/api/notifications/route.ts
[20:59:43.816] 49:7  Warning: Unexpected console statement.  no-console
[20:59:43.816] 68:5  Warning: Unexpected console statement.  no-console
[20:59:43.816] 128:7  Warning: Unexpected console statement.  no-console
[20:59:43.816] 142:5  Warning: Unexpected console statement.  no-console
[20:59:43.816] 
[20:59:43.816] ./app/api/notifications/subscribe/route.ts
[20:59:43.816] 40:7  Warning: Unexpected console statement.  no-console
[20:59:43.816] 53:5  Warning: Unexpected console statement.  no-console
[20:59:43.816] 81:7  Warning: Unexpected console statement.  no-console
[20:59:43.816] 94:5  Warning: Unexpected console statement.  no-console
[20:59:43.816] 
[20:59:43.817] ./app/api/payments/route.ts
[20:59:43.817] 63:9  Warning: Unexpected console statement.  no-console
[20:59:43.817] 101:9  Warning: Unexpected console statement.  no-console
[20:59:43.817] 114:5  Warning: Unexpected console statement.  no-console
[20:59:43.817] 218:7  Warning: Unexpected console statement.  no-console
[20:59:43.817] 227:5  Warning: Unexpected console statement.  no-console
[20:59:43.817] 
[20:59:43.817] ./app/api/razorpay/create-order/route.ts
[20:59:43.817] 84:5  Warning: Unexpected console statement.  no-console
[20:59:43.817] 
[20:59:43.817] ./app/api/razorpay/verify-payment/route.ts
[20:59:43.817] 100:7  Warning: Unexpected console statement.  no-console
[20:59:43.818] 122:7  Warning: Unexpected console statement.  no-console
[20:59:43.818] 136:7  Warning: Unexpected console statement.  no-console
[20:59:43.818] 147:5  Warning: Unexpected console statement.  no-console
[20:59:43.818] 
[20:59:43.818] ./app/api/subscriptions/route.ts
[20:59:43.818] 61:9  Warning: Unexpected console statement.  no-console
[20:59:43.818] 93:9  Warning: Unexpected console statement.  no-console
[20:59:43.818] 106:5  Warning: Unexpected console statement.  no-console
[20:59:43.818] 192:7  Warning: Unexpected console statement.  no-console
[20:59:43.818] 201:5  Warning: Unexpected console statement.  no-console
[20:59:43.818] 
[20:59:43.818] ./app/api/upload/route.ts
[20:59:43.818] 79:7  Warning: Unexpected console statement.  no-console
[20:59:43.819] 111:5  Warning: Unexpected console statement.  no-console
[20:59:43.819] 
[20:59:43.819] ./app/api/users/[id]/route.ts
[20:59:43.819] 52:7  Warning: Unexpected console statement.  no-console
[20:59:43.819] 65:5  Warning: Unexpected console statement.  no-console
[20:59:43.819] 128:7  Warning: Unexpected console statement.  no-console
[20:59:43.831] 142:5  Warning: Unexpected console statement.  no-console
[20:59:43.831] 196:7  Warning: Unexpected console statement.  no-console
[20:59:43.831] 218:7  Warning: Unexpected console statement.  no-console
[20:59:43.831] 231:5  Warning: Unexpected console statement.  no-console
[20:59:43.831] 
[20:59:43.831] ./app/api/users/route.ts
[20:59:43.831] 56:7  Warning: Unexpected console statement.  no-console
[20:59:43.831] 75:5  Warning: Unexpected console statement.  no-console
[20:59:43.831] 
[20:59:43.831] ./app/auth/callback/page.tsx
[20:59:43.831] 22:11  Warning: Unexpected console statement.  no-console
[20:59:43.831] 40:11  Warning: Unexpected console statement.  no-console
[20:59:43.831] 58:13  Warning: Unexpected console statement.  no-console
[20:59:43.832] 81:9  Warning: Unexpected console statement.  no-console
[20:59:43.832] 
[20:59:43.832] ./app/auth/reset-password/confirm/page.tsx
[20:59:43.832] 72:7  Warning: Unexpected console statement.  no-console
[20:59:43.832] 
[20:59:43.832] ./app/auth/reset-password/page.tsx
[20:59:43.832] 47:7  Warning: Unexpected console statement.  no-console
[20:59:43.832] 
[20:59:43.832] ./app/payment-demo/page.tsx
[20:59:43.832] 47:5  Warning: Unexpected console statement.  no-console
[20:59:43.832] 
[20:59:43.832] ./components/admin/DriverApprovalWorkflow.tsx
[20:59:43.833] 285:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[20:59:43.833] 
[20:59:43.833] ./components/admin/UserManagement.tsx
[20:59:43.833] 323:31  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[20:59:43.833] 
[20:59:43.833] ./components/camera/CameraCapture.tsx
[20:59:43.833] 64:7  Warning: Unexpected console statement.  no-console
[20:59:43.833] 255:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[20:59:43.833] 340:7  Warning: Unexpected console statement.  no-console
[20:59:43.833] 355:7  Warning: Unexpected console statement.  no-console
[20:59:43.833] 
[20:59:43.833] ./components/forms/AuthForm.tsx
[20:59:43.833] 80:9  Warning: Unexpected console statement.  no-console
[20:59:43.833] 103:11  Warning: Unexpected console statement.  no-console
[20:59:43.834] 
[20:59:43.834] ./components/forms/DriverRegistrationForm.tsx
[20:59:43.834] 165:7  Warning: Unexpected console statement.  no-console
[20:59:43.834] 
[20:59:43.834] ./components/payments/RazorpayPayment.tsx
[20:59:43.834] 74:7  Warning: Unexpected console statement.  no-console
[20:59:43.834] 107:7  Warning: Unexpected console statement.  no-console
[20:59:43.834] 136:7  Warning: Unexpected console statement.  no-console
[20:59:43.834] 179:13  Warning: Unexpected console statement.  no-console
[20:59:43.834] 207:9  Warning: Unexpected console statement.  no-console
[20:59:43.834] 215:7  Warning: Unexpected console statement.  no-console
[20:59:43.834] 
[20:59:43.834] ./components/pwa/InstallPrompt.tsx
[20:59:43.834] 98:11  Warning: Unexpected console statement.  no-console
[20:59:43.834] 
[20:59:43.835] ./components/realtime/ChatSystem.tsx
[20:59:43.835] 91:7  Warning: Unexpected console statement.  no-console
[20:59:43.839] 
[20:59:43.839] ./components/realtime/DriverSelection.tsx
[20:59:43.840] 58:6  Warning: React Hook useEffect has a missing dependency: 'fetchNearbyDrivers'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[20:59:43.840] 83:7  Warning: Unexpected console statement.  no-console
[20:59:43.840] 112:7  Warning: Unexpected console statement.  no-console
[20:59:43.840] 203:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[20:59:43.840] 
[20:59:43.840] ./components/realtime/FareEstimation.tsx
[20:59:43.840] 71:6  Warning: React Hook useEffect has a missing dependency: 'calculateFare'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[20:59:43.840] 121:7  Warning: Unexpected console statement.  no-console
[20:59:43.840] 
[20:59:43.840] ./components/realtime/LocationTracker.tsx
[20:59:43.840] 66:15  Warning: Unexpected console statement.  no-console
[20:59:43.840] 76:7  Warning: Unexpected console statement.  no-console
[20:59:43.840] 
[20:59:43.840] ./components/screens/MobileAdminPanel.tsx
[20:59:43.840] 200:9  Warning: Unexpected console statement.  no-console
[20:59:43.841] 212:9  Warning: Unexpected console statement.  no-console
[20:59:43.841] 
[20:59:43.846] ./components/sections/DriverShowcase.tsx
[20:59:43.846] 68:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[20:59:43.846] 
[20:59:43.846] ./components/sharing/ShareButton.tsx
[20:59:43.846] 117:7  Warning: Unexpected console statement.  no-console
[20:59:43.846] 
[20:59:43.847] ./components/ui/GoogleAuthButton.tsx
[20:59:43.847] 40:9  Warning: Unexpected console statement.  no-console
[20:59:43.847] 49:7  Warning: Unexpected console statement.  no-console
[20:59:43.847] 
[20:59:43.847] ./components/ui/OptimizedImage.tsx
[20:59:43.847] 88:9  Warning: Unexpected console statement.  no-console
[20:59:43.847] 
[20:59:43.847] ./lib/supabase.ts
[20:59:43.847] 19:5  Warning: Unexpected console statement.  no-console
[20:59:43.847] 29:5  Warning: Unexpected console statement.  no-console
[20:59:43.847] 44:5  Warning: Unexpected console statement.  no-console
[20:59:43.847] 62:5  Warning: Unexpected console statement.  no-console
[20:59:43.847] 83:5  Warning: Unexpected console statement.  no-console
[20:59:43.847] 107:5  Warning: Unexpected console statement.  no-console
[20:59:43.847] 120:5  Warning: Unexpected console statement.  no-console
[20:59:43.847] 140:5  Warning: Unexpected console statement.  no-console
[20:59:43.847] 163:5  Warning: Unexpected console statement.  no-console
[20:59:43.847] 194:5  Warning: Unexpected console statement.  no-console
[20:59:43.847] 
[20:59:43.847] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
[20:59:53.289]    Collecting page data ...
[20:59:55.441]    Generating static pages (0/37) ...
[20:59:55.697] Revenue analytics API error: o [Error]: Dynamic server usage: Page couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
[20:59:55.699]     at a (/vercel/path0/.next/server/chunks/6349.js:1:11854)
[20:59:55.704]     at Object.d [as cookies] (/vercel/path0/.next/server/chunks/6349.js:1:9593)
[20:59:55.704]     at w.getCookie (/vercel/path0/.next/server/chunks/6349.js:1:5450)
[20:59:55.704]     at w.getItem (/vercel/path0/.next/server/chunks/6349.js:1:22821)
[20:59:55.704]     at e9 (/vercel/path0/.next/server/chunks/9720.js:21:25731)
[20:59:55.704]     at aR.__loadSession (/vercel/path0/.next/server/chunks/9720.js:21:57244)
[20:59:55.704]     at aR._useSession (/vercel/path0/.next/server/chunks/9720.js:21:56981)
[20:59:55.704]     at aR._getUser (/vercel/path0/.next/server/chunks/9720.js:21:58844)
[20:59:55.704]     at /vercel/path0/.next/server/chunks/9720.js:21:58695
[20:59:55.704]     at /vercel/path0/.next/server/chunks/9720.js:21:56290 {
[20:59:55.704]   digest: 'DYNAMIC_SERVER_USAGE'
[20:59:55.705] }
[20:59:55.774] [ERROR] [API:dashboard] Analytics dashboard API error o [Error]: Dynamic server usage: Page couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
[20:59:55.774]     at a (/vercel/path0/.next/server/chunks/6349.js:1:11854)
[20:59:55.774]     at Object.d [as cookies] (/vercel/path0/.next/server/chunks/6349.js:1:9593)
[20:59:55.774]     at w.getCookie (/vercel/path0/.next/server/chunks/6349.js:1:5450)
[20:59:55.774]     at w.getItem (/vercel/path0/.next/server/chunks/6349.js:1:22821)
[20:59:55.774]     at e9 (/vercel/path0/.next/server/chunks/9720.js:21:25731)
[20:59:55.774]     at aR.__loadSession (/vercel/path0/.next/server/chunks/9720.js:21:57244)
[20:59:55.774]     at aR._useSession (/vercel/path0/.next/server/chunks/9720.js:21:56981)
[20:59:55.775]     at aR._getUser (/vercel/path0/.next/server/chunks/9720.js:21:58844)
[20:59:55.775]     at /vercel/path0/.next/server/chunks/9720.js:21:58695
[20:59:55.775]     at /vercel/path0/.next/server/chunks/9720.js:21:56290 {
[20:59:55.775]   digest: 'DYNAMIC_SERVER_USAGE'
[20:59:55.775] } undefined
[20:59:55.798] Drivers analytics API error: o [Error]: Dynamic server usage: Page couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
[20:59:55.798]     at a (/vercel/path0/.next/server/chunks/6349.js:1:11854)
[20:59:55.798]     at Object.d [as cookies] (/vercel/path0/.next/server/chunks/6349.js:1:9593)
[20:59:55.798]     at w.getCookie (/vercel/path0/.next/server/chunks/6349.js:1:5450)
[20:59:55.798]     at w.getItem (/vercel/path0/.next/server/chunks/6349.js:1:22821)
[20:59:55.798]     at e9 (/vercel/path0/.next/server/chunks/9720.js:21:25731)
[20:59:55.798]     at aR.__loadSession (/vercel/path0/.next/server/chunks/9720.js:21:57244)
[20:59:55.799]     at aR._useSession (/vercel/path0/.next/server/chunks/9720.js:21:56981)
[20:59:55.799]     at aR._getUser (/vercel/path0/.next/server/chunks/9720.js:21:58844)
[20:59:55.799]     at /vercel/path0/.next/server/chunks/9720.js:21:58695
[20:59:55.799]     at /vercel/path0/.next/server/chunks/9720.js:21:56290 {
[20:59:55.799]   digest: 'DYNAMIC_SERVER_USAGE'
[20:59:55.799] }
[20:59:55.846] Rides analytics API error: o [Error]: Dynamic server usage: Page couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
[20:59:55.846]     at a (/vercel/path0/.next/server/chunks/6349.js:1:11854)
[20:59:55.846]     at Object.d [as cookies] (/vercel/path0/.next/server/chunks/6349.js:1:9593)
[20:59:55.846]     at w.getCookie (/vercel/path0/.next/server/chunks/6349.js:1:5450)
[20:59:55.846]     at w.getItem (/vercel/path0/.next/server/chunks/6349.js:1:22821)
[20:59:55.847]     at e9 (/vercel/path0/.next/server/chunks/9720.js:21:25731)
[20:59:55.847]     at aR.__loadSession (/vercel/path0/.next/server/chunks/9720.js:21:57244)
[20:59:55.847]     at aR._useSession (/vercel/path0/.next/server/chunks/9720.js:21:56981)
[20:59:55.847]     at aR._getUser (/vercel/path0/.next/server/chunks/9720.js:21:58844)
[20:59:55.847]     at /vercel/path0/.next/server/chunks/9720.js:21:58695
[20:59:55.847]     at /vercel/path0/.next/server/chunks/9720.js:21:56290 {
[20:59:55.847]   digest: 'DYNAMIC_SERVER_USAGE'
[20:59:55.847] }
[20:59:55.914] 
   Generating static pages (9/37) 
[20:59:55.939] Nearby drivers API error: o [Error]: Dynamic server usage: Page couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
[20:59:55.939]     at a (/vercel/path0/.next/server/chunks/6349.js:1:11854)
[20:59:55.939]     at Object.d [as cookies] (/vercel/path0/.next/server/chunks/6349.js:1:9593)
[20:59:55.939]     at w.getCookie (/vercel/path0/.next/server/chunks/6349.js:1:5450)
[20:59:55.939]     at w.getItem (/vercel/path0/.next/server/chunks/6349.js:1:22821)
[20:59:55.939]     at e9 (/vercel/path0/.next/server/chunks/9720.js:21:25731)
[20:59:55.940]     at aR.__loadSession (/vercel/path0/.next/server/chunks/9720.js:21:57244)
[20:59:55.940]     at aR._useSession (/vercel/path0/.next/server/chunks/9720.js:21:56981)
[20:59:55.940]     at aR._getUser (/vercel/path0/.next/server/chunks/9720.js:21:58844)
[20:59:55.940]     at /vercel/path0/.next/server/chunks/9720.js:21:58695
[20:59:55.940]     at /vercel/path0/.next/server/chunks/9720.js:21:56290 {
[20:59:55.940]   digest: 'DYNAMIC_SERVER_USAGE'
[20:59:55.940] }
[20:59:55.978] Drivers API error: o [Error]: Dynamic server usage: Page couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
[20:59:55.979]     at a (/vercel/path0/.next/server/chunks/6349.js:1:11854)
[20:59:55.979]     at Object.d [as cookies] (/vercel/path0/.next/server/chunks/6349.js:1:9593)
[20:59:55.979]     at w.getCookie (/vercel/path0/.next/server/chunks/6349.js:1:5450)
[20:59:55.979]     at w.getItem (/vercel/path0/.next/server/chunks/6349.js:1:22821)
[20:59:55.979]     at e9 (/vercel/path0/.next/server/chunks/9720.js:21:25731)
[20:59:55.979]     at aR.__loadSession (/vercel/path0/.next/server/chunks/9720.js:21:57244)
[20:59:55.980]     at aR._useSession (/vercel/path0/.next/server/chunks/9720.js:21:56981)
[20:59:55.980]     at aR._getUser (/vercel/path0/.next/server/chunks/9720.js:21:58844)
[20:59:55.980]     at /vercel/path0/.next/server/chunks/9720.js:21:58695
[20:59:55.980]     at /vercel/path0/.next/server/chunks/9720.js:21:56290 {
[20:59:55.980]   digest: 'DYNAMIC_SERVER_USAGE'
[20:59:55.980] }
[20:59:56.105] 
   Generating static pages (18/37) 
[20:59:56.283] Users API error: o [Error]: Dynamic server usage: Page couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
[20:59:56.284]     at a (/vercel/path0/.next/server/chunks/6349.js:1:11854)
[20:59:56.284]     at Object.d [as cookies] (/vercel/path0/.next/server/chunks/6349.js:1:9593)
[20:59:56.284]     at w.getCookie (/vercel/path0/.next/server/chunks/6349.js:1:5450)
[20:59:56.284]     at w.getItem (/vercel/path0/.next/server/chunks/6349.js:1:22821)
[20:59:56.284]     at e9 (/vercel/path0/.next/server/chunks/9720.js:21:25731)
[20:59:56.284]     at aR.__loadSession (/vercel/path0/.next/server/chunks/9720.js:21:57244)
[20:59:56.284]     at aR._useSession (/vercel/path0/.next/server/chunks/9720.js:21:56981)
[20:59:56.285]     at aR._getUser (/vercel/path0/.next/server/chunks/9720.js:21:58844)
[20:59:56.285]     at /vercel/path0/.next/server/chunks/9720.js:21:58695
[20:59:56.285]     at /vercel/path0/.next/server/chunks/9720.js:21:56290 {
[20:59:56.286]   digest: 'DYNAMIC_SERVER_USAGE'
[20:59:56.286] }
[20:59:56.950] 
   Generating static pages (27/37) 
[20:59:56.977]  ⚠ Entire page /auth/callback deopted into client-side rendering. https://nextjs.org/docs/messages/deopted-into-client-rendering /auth/callback
[20:59:57.082]  ⚠ Entire page /auth/reset-password/confirm deopted into client-side rendering. https://nextjs.org/docs/messages/deopted-into-client-rendering /auth/reset-password/confirm
[20:59:57.638] 
 ✓ Generating static pages (37/37) 
[20:59:58.323]    Finalizing page optimization ...
[20:59:58.324]    Collecting build traces ...
[21:00:03.604] 
[21:00:03.621] Route (app)                              Size     First Load JS
[21:00:03.621] ┌ ○ /                                    27.3 kB         232 kB
[21:00:03.621] ├ ○ /_not-found                          869 B          82.8 kB
[21:00:03.621] ├ ○ /admin                               6.41 kB         177 kB
[21:00:03.621] ├ λ /admin/analytics                     6.67 kB         199 kB
[21:00:03.621] ├ λ /admin/drivers                       6.28 kB         194 kB
[21:00:03.622] ├ ○ /admin/settings                      7.04 kB         178 kB
[21:00:03.622] ├ λ /admin/users                         5.94 kB         198 kB
[21:00:03.622] ├ λ /api/analytics/dashboard             0 B                0 B
[21:00:03.622] ├ λ /api/analytics/drivers               0 B                0 B
[21:00:03.622] ├ λ /api/analytics/revenue               0 B                0 B
[21:00:03.622] ├ λ /api/analytics/rides                 0 B                0 B
[21:00:03.622] ├ λ /api/auth/reset-password             0 B                0 B
[21:00:03.622] ├ λ /api/auth/update-password            0 B                0 B
[21:00:03.622] ├ λ /api/bookings                        0 B                0 B
[21:00:03.622] ├ λ /api/bookings/[id]                   0 B                0 B
[21:00:03.622] ├ λ /api/bookings/[id]/assign-driver     0 B                0 B
[21:00:03.623] ├ λ /api/bookings/[id]/complete          0 B                0 B
[21:00:03.623] ├ λ /api/drivers                         0 B                0 B
[21:00:03.623] ├ λ /api/drivers/[id]                    0 B                0 B
[21:00:03.623] ├ λ /api/drivers/[id]/approve            0 B                0 B
[21:00:03.623] ├ λ /api/drivers/[id]/location           0 B                0 B
[21:00:03.623] ├ λ /api/drivers/[id]/reject             0 B                0 B
[21:00:03.623] ├ λ /api/drivers/[id]/rides              0 B                0 B
[21:00:03.623] ├ λ /api/drivers/[id]/suspend            0 B                0 B
[21:00:03.623] ├ λ /api/drivers/nearby                  0 B                0 B
[21:00:03.623] ├ λ /api/drivers/register                0 B                0 B
[21:00:03.623] ├ λ /api/errors                          0 B                0 B
[21:00:03.624] ├ λ /api/notifications                   0 B                0 B
[21:00:03.624] ├ λ /api/notifications/[id]              0 B                0 B
[21:00:03.625] ├ λ /api/notifications/subscribe         0 B                0 B
[21:00:03.625] ├ λ /api/payments                        0 B                0 B
[21:00:03.625] ├ λ /api/razorpay/create-order           0 B                0 B
[21:00:03.625] ├ λ /api/razorpay/verify-payment         0 B                0 B
[21:00:03.625] ├ λ /api/subscriptions                   0 B                0 B
[21:00:03.625] ├ λ /api/upload                          0 B                0 B
[21:00:03.625] ├ λ /api/users                           0 B                0 B
[21:00:03.625] ├ λ /api/users/[id]                      0 B                0 B
[21:00:03.626] ├ ○ /auth/callback                       1.56 kB         161 kB
[21:00:03.626] ├ ○ /auth/login                          7.15 kB         211 kB
[21:00:03.626] ├ ○ /auth/reset-password                 2.32 kB         124 kB
[21:00:03.626] ├ ○ /auth/reset-password/confirm         7.9 kB          123 kB
[21:00:03.626] ├ ○ /dashboard                           5.92 kB         177 kB
[21:00:03.626] ├ ○ /driver                              4.22 kB         191 kB
[21:00:03.626] ├ ○ /driver/register                     5.96 kB         198 kB
[21:00:03.626] ├ ○ /payment-demo                        2.67 kB         190 kB
[21:00:03.626] └ ○ /realtime-demo                       16.2 kB         192 kB
[21:00:03.627] + First Load JS shared by all            81.9 kB
[21:00:03.627]   ├ chunks/938-0885d4df9017478b.js       26.7 kB
[21:00:03.627]   ├ chunks/fd9d1056-fd90921e08aa483f.js  53.3 kB
[21:00:03.627]   ├ chunks/main-app-01dcb8892b176af1.js  220 B
[21:00:03.627]   └ chunks/webpack-4e72d1cb4bd27dc9.js   1.75 kB
[21:00:03.627] 
[21:00:03.627] 
[21:00:03.627] ƒ Middleware                             41.8 kB
[21:00:03.627] 
[21:00:03.628] ○  (Static)   prerendered as static content
[21:00:03.628] λ  (Dynamic)  server-rendered on demand using Node.js
[21:00:03.628] 
[21:00:03.768] Traced Next.js server files in: 27.054ms
[21:00:03.927] Created all serverless functions in: 158.968ms
[21:00:04.008] Collected static files (public/, static/, .next/static): 13.874ms
[21:00:04.123] Build Completed in /vercel/output [1m]
[21:00:04.293] Deploying outputs...
[21:00:14.023] Deployment completed
[21:00:15.019] Creating build cache...
[21:00:31.999] Created build cache: 16.980s
[21:00:32.000] Uploading build cache [189.98 MB]
[21:00:34.773] Build cache uploaded: 2.774s