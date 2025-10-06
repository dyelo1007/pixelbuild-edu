import { motion, type Variants } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import API from "@/utils/api";
import { AxiosError } from "axios";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IoHammer } from "react-icons/io5";
import {
  FaMicrochip,
  FaPuzzlePiece,
  FaQuestionCircle,
  FaBookOpen,
} from "react-icons/fa";

// --- Form Validation Schema ---
const schema = yup
  .object({
    name: yup.string().required("Your name is required."),
    username: yup.string().optional(),
    email: yup
      .string()
      .email("Please enter a valid email.")
      .required("Your email is required."),
    message: yup
      .string()
      .required("A message is required.")
      .min(10, "Message must be at least 10 characters long."),
  })
  .required();

type ContactFormData = {
  name: string;
  username?: string;
  email: string;
  message: string;
};

// --- Animation Variants ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const AboutPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver<ContactFormData, unknown, ContactFormData>(
      schema as yup.ObjectSchema<ContactFormData>
    ),

    defaultValues: {
      name: "",
      username: "",
      email: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    const toastId = toast.loading("Sending your message...");
    try {
      const response = await API.post("/contact", data);
      toast.success(response.data.message, { id: toastId });
      reset();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to send message.",
        { id: toastId }
      );
    }
  };

  const features = [
    {
      icon: <FaMicrochip className="text-neonblue" size={40} />,
      title: "Free Build Sandbox",
      desc: "Experiment with components and save your creations.",
    },
    {
      icon: <FaPuzzlePiece className="text-neonblue" size={40} />,
      title: "Challenge Mode",
      desc: "Solve compatibility puzzles to test your practical skills.",
    },
    {
      icon: <FaQuestionCircle className="text-neonblue" size={40} />,
      title: "Quiz Mode",
      desc: "Reinforce your knowledge with interactive quizzes.",
    },
    {
      icon: <FaBookOpen className="text-neonblue" size={40} />,
      title: "Review Mode",
      desc: "Create and practice your own custom flashcard sets.",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:px-20 py-16 space-y-24">
      {/* About Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="grid lg:grid-cols-2 gap-10 items-center"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-neonblue mb-6">
            About PixelBuild Edu
          </h1>
          <p className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            PixelBuild is an educational platform designed to make PC building
            simple, interactive, and fun. Whether you’re a beginner exploring
            your first setup or an experienced enthusiast, we provide the tools
            to learn, build, and master computer hardware.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            From hands-on challenges to custom study sets, PixelBuild offers an
            all-in-one solution to understand computers better, making the
            process engaging and rewarding.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-64 h-64 flex items-center justify-center rounded-full bg-lightfill dark:bg-darkfill shadow-lg border-4 border-neonblue/20">
            <IoHammer className="text-neonblue" size={128} />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-neonblue text-center mb-12">
          What You Can Do
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-lightbg dark:bg-darkbg border border-neonblue/20 p-6 rounded-xl h-full">
                <div className="w-20 h-20 flex items-center justify-center mb-4 rounded-full bg-lightfill dark:bg-darkfill mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="flex items-center mb-10">
          <IoHammer className="text-neonblue mr-4" size={40} />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Contact Us
          </h2>
        </div>
        <Card className="border border-neonblue/30 bg-lightbg dark:bg-darkbg p-6 sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid lg:grid-cols-2 gap-8"
          >
            <div className="flex flex-col space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="username">PixelBuild Username (Optional)</Label>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                {...register("message")}
                placeholder="Write your concern or feedback here..."
                rows={8}
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.message.message}
                </p>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 bg-neonblue text-black hover:bg-hoverprimary self-end"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.section>
    </div>
  );
};

export default AboutPage;
