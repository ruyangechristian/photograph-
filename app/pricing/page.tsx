import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const packages = [
    {
      name: "WEDDINGS",
      description: "Full day coverage of your special day",
      price: "Starting at $2,500",
      features: [
        "8 hours of coverage",
        "Second photographer",
        "Online gallery",
        "High-resolution digital files",
        "Engagement session",
        "Wedding album consultation",
      ],
      popular: true,
    },
    {
      name: "PORTRAITS",
      description: "Individual or family portrait sessions",
      price: "Starting at $350",
      features: [
        "1-2 hour session",
        "Multiple outfit changes",
        "Online gallery",
        "10 digital images",
        "Print release",
        "Location of your choice",
      ],
      popular: false,
    },
    {
      name: "EVENTS",
      description: "Corporate events, parties, and celebrations",
      price: "Starting at $750",
      features: [
        "4 hours of coverage",
        "Online gallery",
        "High-resolution digital files",
        "Quick turnaround",
        "Professional editing",
        "Commercial usage rights",
      ],
      popular: false,
    },
  ]

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-light text-center mb-6">PRICING</h1>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
        Investment in professional photography is an investment in your memories. Below are my starting packages, but
        I'm happy to create a custom package tailored to your specific needs.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className={`border ${pkg.popular ? "border-black" : "border-gray-200"} p-6 flex flex-col relative`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 bg-black text-white text-xs px-3 py-1 transform translate-y-[-50%]">
                POPULAR
              </div>
            )}
            <h2 className="text-xl font-medium mb-2">{pkg.name}</h2>
            <p className="text-gray-600 mb-4">{pkg.description}</p>
            <p className="text-2xl font-light mb-6">{pkg.price}</p>
            <ul className="space-y-3 mb-8 flex-grow">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-black mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact">
              <button
                className={`w-full py-3 ${pkg.popular ? "bg-black text-white" : "border border-black"} hover:bg-gray-800 hover:text-white transition duration-300`}
              >
                BOOK NOW
              </button>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-light mb-6">ADDITIONAL SERVICES</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="border border-gray-200 p-6">
            <h3 className="font-medium mb-2">PHOTO ALBUMS</h3>
            <p className="text-gray-600">Starting at $350</p>
          </div>
          <div className="border border-gray-200 p-6">
            <h3 className="font-medium mb-2">PRINTS & WALL ART</h3>
            <p className="text-gray-600">Starting at $75</p>
          </div>
          <div className="border border-gray-200 p-6">
            <h3 className="font-medium mb-2">ADDITIONAL HOURS</h3>
            <p className="text-gray-600">$250 per hour</p>
          </div>
          <div className="border border-gray-200 p-6">
            <h3 className="font-medium mb-2">SECOND PHOTOGRAPHER</h3>
            <p className="text-gray-600">$500 per event</p>
          </div>
          <div className="border border-gray-200 p-6">
            <h3 className="font-medium mb-2">TRAVEL FEES</h3>
            <p className="text-gray-600">Varies by location</p>
          </div>
          <div className="border border-gray-200 p-6">
            <h3 className="font-medium mb-2">RUSH EDITING</h3>
            <p className="text-gray-600">Starting at $200</p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-light mb-4">READY TO BOOK?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Contact me today to check availability for your date and discuss the perfect photography package for your
          needs.
        </p>
        <Link href="/contact">
          <button className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition duration-300">
            CONTACT ME
          </button>
        </Link>
      </div>
    </div>
  )
}
