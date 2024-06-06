import { FAQs } from "./FAQs";
import { Metadata } from "next";
import { meta } from "~/lib/meta";
import dataFAQs from "./faqs.json";
import { ContactForm } from "./contact";
import { getUser } from "~/app/server/user";

export const metadata: Metadata = {
  title: "Support",
  description: meta.APP_DESCRIPTION,
};

export default async () => {
  const user = await getUser();

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-teal-500 dark:text-fuchsia-400 mb-8">
          Support Center 🤞
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Welcome to our Support Center.
          <br />
          <br /> At Agri Arena, we are committed to providing exceptional
          support to help you get the most out of our platform. Whether you have
          questions about connecting your IoT devices, understanding our crop
          recommendations, or need assistance with any issues, our dedicated
          team is here to assist you. Explore our frequently asked questions
          below or get in touch with us directly for personalized support.
        </p>

        <div className="mt-20 space-y-20">
          <section>
            <h2 className="text-xl font-semibold text-lime-600 dark:text-lime-300 mb-4">
              Frequently Asked Questions 💬
            </h2>
            <FAQs data={dataFAQs} />
          </section>

          <section>
            <div className="flex flex-col items-end">
              <h2 className="text-2xl font-semibold text-amber-700">
                Contact with us 📜
              </h2>
              <ContactForm name={user?.name} email={user?.email} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/*
<div className="relative w-full h-screen overflow-hidden">
  <div className="absolute top-0 left-0 w-full h-screen bg-cover mix-blend-overlay"></div>
  <div className="absolute top-1/2 left-1/2 w-32 h-40 transform -translate-x-1/2 -translate-y-1/2">
    <div className="absolute w-full h-full rounded-full bg-yellow-400/50 mix-blend-multiply blur-[80px] animate-circular2"></div>
    <div className="absolute w-full h-full rounded-full bg-yellow-500 mix-blend-multiply blur-[80px] animate-circular"></div>
    <div className="absolute w-full h-full rounded-full bg-lime-500 mix-blend-multiply blur-[80px] animate-circular"></div>
  </div>
</div>
*/
