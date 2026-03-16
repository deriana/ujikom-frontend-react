import { Github, Facebook, Instagram, Twitter } from 'lucide-react';

const SOCIAL_LINKS = [
  { 
    icon: <Github size={20} />, 
    href: "https://github.com/deriana", 
    label: "Github", 
    color: "hover:bg-gray-800 hover:text-white" 
  },
  { 
    icon: <Facebook size={20} />, 
    href: "https://facebook.com/jerri.maruf", 
    label: "Facebook", 
    color: "hover:bg-blue-600 hover:text-white" 
  },
  { 
    icon: <Instagram size={20} />, 
    href: "https://instagram.com/hi_deri_", 
    label: "Instagram", 
    color: "hover:bg-pink-600 hover:text-white" 
  },
  { 
    icon: <Twitter size={20} />, 
    href: "https://x.com/Deriana765", 
    label: "X (Twitter)", 
    color: "hover:bg-black hover:text-white" 
  },
];

const SocialIcons = () => {
  return (
    <div className="flex gap-4">
      {SOCIAL_LINKS.map((social, i) => (
        <a
          key={i}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center transition-all duration-300 ${social.color} hover:-translate-y-1 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600  shadow-sm`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;