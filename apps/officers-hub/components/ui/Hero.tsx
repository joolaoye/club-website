import { Button } from "@club-website/ui/components/button";


export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]">
          <svg
            className="absolute inset-0 h-full w-full fill-gray-50"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
          </svg>
        </div>
      </div>

      <div className="mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">CS</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Computer Science Club
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg leading-8 text-gray-600">
          St. Cloud State University's student computing community
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <Button size="lg" className="px-8 py-6 text-lg">
            Join Us
          </Button>
        </div>
      </div>
    </section>
  );
} 