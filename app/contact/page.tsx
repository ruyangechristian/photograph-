"use client"; // Add this at the top

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from 'react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('first-name') as string,
      lastName: formData.get('last-name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      service: formData.get('service') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-light text-center mb-12 md:mb-16">CONTACT</h1>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-xl md:text-2xl font-light mb-6">GET IN TOUCH</h2>
          <p className="text-gray-600 mb-8">
            I'd love to hear from you! Whether you're interested in booking a session, have questions about my services,
            or just want to say hello, please don't hesitate to reach out.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <Mail className="w-5 h-5 mt-1 mr-3 text-gray-600" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">info@iremefocus.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-5 h-5 mt-1 mr-3 text-gray-600" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-gray-600">0788718396</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-5 h-5 mt-1 mr-3 text-gray-600 flex items-center justify-center">@</div>
              <div>
                <h3 className="font-medium">Instagram</h3>
                <p className="text-gray-600">@ruyange_christian</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mt-1 mr-3 text-gray-600" />
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="text-gray-600">Available for travel worldwide</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-5 h-5 mt-1 mr-3 text-gray-600" />
              <div>
                <h3 className="font-medium">Office Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9am - 5pm</p>
                <p className="text-gray-600">Weekends: By appointment</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
              There was an error sending your message. Please try again later.
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  name="first-name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  name="last-name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                Service Interested In
              </label>
              <select
                id="service"
                name="service"
                required
                className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
              >
                <option value="">Select a service</option>
                <option value="wedding">Wedding Photography</option>
                <option value="engagement">Engagement Session</option>
                <option value="portrait">Portrait Session</option>
                <option value="event">Event Coverage</option>
                <option value="commercial">Commercial Photography</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-black text-white hover:bg-gray-800 transition duration-300 disabled:opacity-70"
              >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}