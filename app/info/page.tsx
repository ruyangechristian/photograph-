import Image from "next/image"
import Link from "next/link"
import { Camera, Clock, Heart, Award, Users, MapPin } from "lucide-react"

export default function InfoPage() {
  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-light mb-4">ABOUT US</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Capturing your special moments with creativity, passion, and attention to detail
        </p>
      </div>

      {/* About Section */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-20">
        <div>
          <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">OUR STORY</h2>
          <p className="text-gray-600 mb-4">
            IREMEFOCUS was founded with a simple mission: to capture the most beautiful and authentic moments of your
            special occasions. With years of experience photographing weddings and events, we've developed a unique
            style that blends artistic vision with genuine emotion.
          </p>
          <p className="text-gray-600 mb-4">
            We believe that every event tells a unique story, and we're passionate about documenting those stories
            through our lenses. From the nervous excitement as you prepare for a ceremony to the joyful celebration on
            the dance floor, we're there to capture it all.
          </p>
          <p className="text-gray-600">
            Based in the heart of the city but available for destination events worldwide, we bring our expertise and
            artistic eye to every occasion we photograph.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
          <Image src="/images/landscape-tea-path.png" alt="Photography example" fill className="object-cover" />
        </div>
      </div>

      {/* Our Approach */}
      <div className="mb-16 md:mb-20">
        <h2 className="text-xl md:text-2xl font-light mb-6 md:mb-8 text-center">OUR APPROACH</h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <Heart className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="text-lg md:text-xl font-medium mb-2">Authentic Moments</h3>
            <p className="text-gray-600">
              We focus on capturing genuine emotions and interactions, creating images that tell your unique story.
            </p>
          </div>
          <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <Camera className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="text-lg md:text-xl font-medium mb-2">Artistic Vision</h3>
            <p className="text-gray-600">
              Our creative approach combines documentary-style photography with artistic compositions and lighting.
            </p>
          </div>
          <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="text-lg md:text-xl font-medium mb-2">Personal Connection</h3>
            <p className="text-gray-600">
              We build relationships with our clients to ensure comfort and trust throughout the photography process.
            </p>
          </div>
        </div>
      </div>

      {/* Photography Experience */}
      <div className="mb-16 md:mb-20">
        <h2 className="text-xl md:text-2xl font-light mb-6 md:mb-8 text-center">PHOTOGRAPHY EXPERIENCE</h2>
        <div className="bg-gray-50 p-6 md:p-8 rounded-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg md:text-xl font-medium mb-4">What to Expect</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-700 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Full Coverage</p>
                    <p className="text-gray-600">
                      From preparation to final moments, we capture your entire event journey
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-gray-700 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Professional Editing</p>
                    <p className="text-gray-600">Every image is carefully edited to enhance its natural beauty</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-700 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Location Scouting</p>
                    <p className="text-gray-600">We'll help find the perfect spots for your portraits</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
              <Image src="/images/landscape-bridge.png" alt="Photography example" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="mb-16 md:mb-20">
        <h2 className="text-xl md:text-2xl font-light mb-6 md:mb-8 text-center">CLIENT LOVE</h2>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm max-w-3xl mx-auto">
          <blockquote className="text-lg md:text-xl font-light italic mb-6 text-center">
            "IREMEFOCUS captured our special day perfectly. The photos are beyond what we could have imagined - they
            truly tell the story of our day and bring back all the emotions every time we look at them."
          </blockquote>
          <p className="text-gray-600 text-center">— Sarah & Michael, 2023</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-light mb-4">GET IN TOUCH</h2>
        <p className="text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
          We'd love to be part of your special day. Contact us to check availability and discuss your photography needs.
        </p>
        <Link href="/contact">
          <button className="px-6 md:px-8 py-3 bg-black text-white hover:bg-gray-800 transition duration-300">
            CONTACT US
          </button>
        </Link>
      </div>
    </div>
  )
}
