import { meta } from "~/lib/meta";
import { Metadata } from "next";

import { TeamDetails } from "./team";

export const metadata: Metadata = {
  title: "About",
  description: meta.APP_DESCRIPTION,
};

export default function Page() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#6a0dad] dark:text-yellow-300 mb-8">
            Welcome to Agri Arena
          </h1>
          <p className="mt-4 text-lg leading-6 text-gray-600 dark:text-gray-300">
            Where cutting-edge technology meets agriculture to empower farmers
            and revolutionize the way we cultivate our land.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-3xl font-semibold text-[#006400] dark:text-yellow-300 mb-4">
              Our Vision
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              At Agri Arena, we envision a future where every farmer has access
              to advanced tools that make farming smarter, more efficient, and
              sustainable. By integrating the latest advancements in IoT,
              Machine Learning, and Image Processing, we aim to provide
              actionable insights that help farmers make informed decisions,
              increase crop yields, and combat agricultural challenges.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#006400] dark:text-yellow-300 mb-4">
              What We Offer
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-lg text-gray-700 dark:text-gray-300">
              <li>
                <strong>IoT-Driven Insights:</strong> Our platform seamlessly
                integrates with IoT devices to gather real-time data on
                essential agricultural parameters such as NPK levels, humidity,
                temperature, soil moisture, and pH. This data serves as the
                foundation for making precise agricultural decisions.
              </li>
              <li>
                <strong>Crop Recommendation via Machine Learning:</strong>{" "}
                Leveraging the power of Machine Learning, Agri Arena analyzes
                the collected data to recommend the best crops for your specific
                conditions. Our predictive models take into account various
                factors to suggest crops that are most likely to thrive,
                ensuring better yields and optimal use of resources.
              </li>
              <li>
                <strong>Disease Detection through Image Processing:</strong>{" "}
                With our advanced image processing technology, users can easily
                detect crop diseases early by simply uploading images of
                affected plants. Our system identifies the disease and provides
                actionable advice on how to manage or eradicate it, saving time
                and preventing potential losses.
              </li>
              <li>
                <strong>Built with Robust Technology:</strong> Agri Arena is
                built on a modern tech stack that includes Next.js for a fast
                and responsive user interface, PostgreSQL for reliable data
                management, and AWS for scalable cloud services. Our platform is
                designed to be secure, efficient, and capable of handling the
                demands of modern agriculture.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#006400] dark:text-yellow-300 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Our mission is to empower farmers with the tools they need to
              thrive in a rapidly changing world. We believe that technology is
              the key to solving some of the most pressing challenges in
              agriculture, from climate change to food security. Agri Arena is
              here to bridge the gap between traditional farming practices and
              the digital future.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#006400] dark:text-yellow-300 mb-4">
              Join Us on Our Journey
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              We invite you to join us on this exciting journey to transform
              agriculture. Whether you are a farmer looking to optimize your
              operations, a tech enthusiast interested in the intersection of
              technology and agriculture, or an investor seeking the next big
              innovation in agritech, Agri Arena welcomes you.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
              Together, let's cultivate a smarter, more sustainable future.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
