import {
  BookOpen,
  Users,
  Award,
  Shield,
  Trophy,
  Rocket,
  Code,
} from "lucide-react";

export const stats = [
  {
    value: "50+",
    label: "Interactive Courses",
    icon: BookOpen,
    color: "purple",
  },
  {
    value: "10k+",
    label: "Active Learners",
    icon: Users,
    color: "blue",
  },
  {
    value: "100+",
    label: "Achievements",
    icon: Award,
    color: "yellow",
  },
  {
    value: "24/7",
    label: "Community Support",
    icon: Shield,
    color: "green",
  },
];

export const features = [
  {
    icon: BookOpen,
    title: "Hands-on Learning",
    description:
      "Build real projects and applications while learning. No boring tutorials.",
    gradient: "from-purple-500 to-pink-500",
    delay: 0,
  },
  {
    icon: Trophy,
    title: "Gamified Experience",
    description: "Earn XP, unlock achievements, and compete on leaderboards.",
    gradient: "from-yellow-500 to-orange-500",
    delay: 0.1,
  },
  {
    icon: Rocket,
    title: "Career Ready",
    description:
      "Learn industry-relevant skills and build a portfolio that stands out.",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0.2,
  },
];

export const steps = [
  {
    step: "01",
    title: "Sign Up",
    description: "Create your free account",
    icon: Users,
  },
  {
    step: "02",
    title: "Choose Path",
    description: "Pick your learning track",
    icon: BookOpen,
  },
  {
    step: "03",
    title: "Start Building",
    description: "Learn with projects",
    icon: Code,
  },
  {
    step: "04",
    title: "Level Up",
    description: "Earn achievements",
    icon: Trophy,
  },
];
export const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    content:
      "This platform completely changed how I learn. The project-based approach is amazing!",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Full Stack Dev",
    content:
      "Best investment in my career. The gamification keeps me motivated every day.",
    rating: 5,
  },
  {
    name: "Emma Watson",
    role: "CS Student",
    content:
      "Finally found a platform that makes learning fun and practical. Highly recommended!",
    rating: 5,
  },
];
export const footerLinks = [
  { label: "About", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];
