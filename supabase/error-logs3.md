23:01:02.262 Running build in Washington, D.C., USA (East) – iad1
23:01:02.263 Build machine configuration: 2 cores, 8 GB
23:01:02.409 Cloning github.com/ledjayrafael/nexapos (Branch: main, Commit: 7dfe454)
23:01:02.410 Previous build caches not available.
23:01:02.833 Cloning completed: 423.000ms
23:01:05.073 Running "vercel build"
23:01:05.750 Vercel CLI 50.27.1
23:01:06.055 Installing dependencies...
23:01:10.888 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
23:01:23.244 
23:01:23.245 added 717 packages in 17s
23:01:23.249 
23:01:23.249 236 packages are looking for funding
23:01:23.249   run `npm fund` for details
23:01:23.433 Detected Next.js version: 16.1.6
23:01:23.442 Running "npm run build"
23:01:23.561 
23:01:23.561 > nexapos@0.1.0 build
23:01:23.562 > next build
23:01:23.562 
23:01:24.783 Attention: Next.js now collects completely anonymous telemetry regarding usage.
23:01:24.784 This information is used to shape Next.js' roadmap and prioritize features.
23:01:24.785 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
23:01:24.785 https://nextjs.org/telemetry
23:01:24.786 
23:01:24.800 ▲ Next.js 16.1.6 (Turbopack)
23:01:24.801 
23:01:24.809 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
23:01:24.835   Creating an optimized production build ...
23:01:36.484 ✓ Compiled successfully in 11.2s
23:01:36.486   Running TypeScript ...
23:01:41.215 Failed to compile.
23:01:41.215 
23:01:41.216 ./src/app/developer/users/page.tsx:32:31
23:01:41.216 Type error: Type '(formData: FormData) => Promise<{ error: string; success?: undefined; } | { success: boolean; error?: undefined; }>' is not assignable to type 'string | ((formData: FormData) => void | Promise<void>) | undefined'.
23:01:41.216   Type '(formData: FormData) => Promise<{ error: string; success?: undefined; } | { success: boolean; error?: undefined; }>' is not assignable to type '(formData: FormData) => void | Promise<void>'.
23:01:41.217     Type 'Promise<{ error: string; success?: undefined; } | { success: boolean; error?: undefined; }>' is not assignable to type 'void | Promise<void>'.
23:01:41.217       Type 'Promise<{ error: string; success?: undefined; } | { success: boolean; error?: undefined; }>' is not assignable to type 'Promise<void>'.
23:01:41.217         Type '{ error: string; success?: undefined; } | { success: boolean; error?: undefined; }' is not assignable to type 'void'.
23:01:41.217           Type '{ error: string; success?: undefined; }' is not assignable to type 'void'.
23:01:41.217 
23:01:41.218 [0m [90m 30 |[39m                     [33m<[39m[33m/[39m[33mCardHeader[39m[33m>[39m
23:01:41.218  [90m 31 |[39m                     [33m<[39m[33mCardContent[39m[33m>[39m
23:01:41.218 [31m[1m>[22m[39m[90m 32 |[39m                         [33m<[39m[33mform[39m action[33m=[39m{addCashier} className[33m=[39m[32m"space-y-4"[39m[33m>[39m
23:01:41.218  [90m    |[39m                               [31m[1m^[22m[39m
23:01:41.218  [90m 33 |[39m                             [33m<[39m[33mdiv[39m className[33m=[39m[32m"space-y-2"[39m[33m>[39m
23:01:41.218  [90m 34 |[39m                                 [33m<[39m[33mLabel[39m htmlFor[33m=[39m[32m"email"[39m className[33m=[39m[32m"text-zinc-200"[39m[33m>[39m[33mEmail[39m [33mAddress[39m[33m<[39m[33m/[39m[33mLabel[39m[33m>[39m
23:01:41.218  [90m 35 |[39m                                 [33m<[39m[33mInput[39m[0m
23:01:41.250 Next.js build worker exited with code: 1 and signal: null
23:01:41.302 Error: Command "npm run build" exited with 1