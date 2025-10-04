import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import pbHammer from "../assets/about-page-imgs/pb-hammer.png";
import pbTodo1 from "../assets/about-page-imgs/pb-todo1.png";
import pbTodo2 from "../assets/about-page-imgs/pb-todo2.png";
import pbTodo3 from "../assets/about-page-imgs/pb-todo3.png";
import pbTodo4 from "../assets/about-page-imgs/pb-todo4.png";
import pbTodo5 from "../assets/about-page-imgs/pb-todo5.png";
import pbContact from "../assets/about-page-imgs/pb-contact.png";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: ["easeOut"] },
  },
};

const AboutPage = () => {
  return (
    <div className="text-white min-h-screen px-6 lg:px-20 py-16 space-y-32">
      {/* About */}
      <motion.section
        className="grid lg:grid-cols-2 gap-10 items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-neonblue mb-6">
            About PixelBuild
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            PixelBuild is a platform designed to make PC building simple,
            interactive, and fun. Whether you’re a beginner exploring your first
            setup or an experienced enthusiast, PixelBuild gives you the tools
            to filter, choose, and assemble your dream PC with ease.
          </p>
          <p className="text-lg leading-relaxed">
            From learning about components to testing your knowledge through
            challenges, PixelBuild offers an all-in-one solution to understand
            computers better while making the process engaging and rewarding.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src={pbHammer}
            alt="PixelBuild Hammer"
            className="w-80 h-80 object-contain rounded-full p-6"
          />
        </div>
      </motion.section>

      {/* To Do Cards */}
      <motion.section
        className="mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-neonblue text-center mb-12">
          What to do in PixelBuild?
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 text-center">
          {[
            {
              img: pbTodo1,
              title: "Build PC with Parts Filtering",
              desc: "Easily design your dream PC by selecting components that perfectly match your needs and budget. Filter by compatibility, performance, and price to find the best parts.",
            },
            {
              img: pbTodo2,
              title: "Save Your Build",
              desc: "Keep track of your creations by saving them. Update or share your builds anytime for easy access.",
            },
            {
              img: pbTodo3,
              title: "Know Your Parts",
              desc: "Learn detailed specs and tips for every component to make the best choices based on your use case—whether gaming, content creation, or work.",
            },
            {
              img: pbTodo4,
              title: "Check Pre-Built PCs",
              desc: "Browse curated pre-assembled PCs. Compare specs, pricing, and see if they meet your requirements without the hassle of starting from scratch.",
            },
            {
              img: pbTodo5,
              title: "Clear Challenges",
              desc: "Test your PC knowledge through interactive challenges. From identifying parts to optimizing builds, each challenge sharpens your skills.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center p-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-28 h-28 flex items-center justify-center mb-4">
                <img
                  src={item.img}
                  alt={item.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h3 className="text-md font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Us */}
      <motion.section
        className="mt-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="flex items-center mb-10">
          <img src={pbContact} alt="Contact Icon" className="w-14 h-12 mr-4" />
          <h2 className="text-3xl lg:text-4xl font-bold tracking-wider">
            Contact us
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="flex flex-col space-y-6">
            <div>
              <input
                type="text"
                placeholder="Full name"
                className="w-full p-3 border border-neonblue rounded-sm bg-[#2b2b2b]/70"
              />
              <p className="text-gray-400 text-sm mt-1">Enter your full name</p>
            </div>

            <div>
              <input
                type="text"
                placeholder="Pixel Build username"
                className="w-full p-3 bg-[#2b2b2b]/70 border border-neonblue rounded-sm"
              />
              <p className="text-gray-400 text-sm mt-1">
                Enter your Pixel Build username
              </p>
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-[#2b2b2b]/70 border border-neonblue rounded-sm"
              />
              <p className="text-gray-400 text-sm mt-1">Enter your email</p>
            </div>
          </div>

          {/* Right Side: Message */}
          <div className="flex flex-col">
            <textarea
              placeholder="Write your concern"
              rows={8}
              className="w-full p-3 bg-[#2b2b2b]/70 border border-neonblue rounded-lg"
            ></textarea>

            <button className="mt-4 px-6 py-2 bg-neonblue cursor-pointer hover:bg-hoverprimary text-white rounded-full self-end">
              Send
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
