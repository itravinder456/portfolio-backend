import mongoose from "mongoose";
import dotenv from "dotenv";

// Import your models (adjust paths as needed)
import Skill from "./models/Skill";
import Experience from "./models/Experience";
import Education from "./models/Education";
import Project from "./models/Project";
import Blog from "./models/Blog";
import Profile from "./models/Profile";
import Achievement from "./models/Achievement";

dotenv.config();

export async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);

  // Skills
  await Skill.deleteMany({});
  await Skill.insertMany([
    // Top Skills
    {
      name: "React.js",
      category: "Frontend",
      proficiency: "Expert",
      isTopSkill: true,
      level: "95",
    },
    {
      name: "JavaScript (ES6+)",
      category: "Frontend",
      proficiency: "Expert",
      isTopSkill: true,
      level: "90",
    },
    {
      name: "Node.js",
      category: "Backend",
      proficiency: "Expert",
      isTopSkill: true,
      level: "90",
    },
    {
      name: "AWS",
      category: "Cloud",
      proficiency: "Intermediate",
      isTopSkill: true,
      level: "75",
    },

    // Frontend
    {
      name: "Next.js",
      category: "Frontend",
      proficiency: "Advanced",
      level: "85",
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
      proficiency: "Advanced",
      level: "80",
    },
    {
      name: "JavaScript (ES6+)",
      category: "Frontend",
      proficiency: "Expert",
      level: "95",
    },

    // Backend
    {
      name: "Express.js",
      category: "Backend",
      proficiency: "Advanced",
      level: "85",
    },
    {
      name: "REST APIs",
      category: "Backend",
      proficiency: "Expert",
      level: "90",
    },
    {
      name: "GraphQL",
      category: "Backend",
      proficiency: "Intermediate",
      level: "70",
    },

    // Database
    {
      name: "MongoDB",
      category: "Database",
      proficiency: "Expert",
      level: "90",
    },
    {
      name: "MySQL",
      category: "Database",
      proficiency: "Advanced",
      level: "85",
    },
    {
      name: "PostgreSQL",
      category: "Database",
      proficiency: "Intermediate",
      level: "75",
    },

    // Tools & Others
    {
      name: "Git & GitHub",
      category: "Tools",
      proficiency: "Expert",
      level: "95",
    },
    {
      name: "Docker",
      category: "Tools",
      proficiency: "Intermediate",
      level: "70",
    },
    {
      name: "AWS (S3, EC2)",
      category: "Cloud",
      proficiency: "Intermediate",
      level: "75",
    },
    {
      name: "Firebase",
      category: "Tools",
      proficiency: "Advanced",
      level: "80",
    },
  ]);

  // Experience
  await Experience.deleteMany({});
  await Experience.insertMany([
    {
      company: "EPAM",
      location: "Hyderabad, India",
      technologies: ["MERN Stack", "JavaScript", "TypeScript"],
      roles: [
        {
          role: "Senior Software Engineer",
          period: "Nov 2024 - Present",
          description:
            "Working on full-stack web applications, collaborating with cross-functional teams to deliver client solutions and improvements.",
        },
      ],
    },
    {
      company: "LTIMindtree",
      location: "Hyderabad, India",
      technologies: ["MERN Stack", "Agile"],
      roles: [
        {
          role: "Specialist - Software Engineering",
          period: "Nov 2022 - Oct 2024",
          description:
            "Led client communications, managed sprint planning, and internal grooming of web applications. Responsible for design, development, testing, and deployment.",
        },
        {
          role: "Module Lead",
          period: "Sep 2022 - Nov 2022",
          description:
            "Handled project updates, sprint planning, and implemented web applications based on client requirements.",
        },
      ],
    },
    {
      company: "DevRabbit IT Solutions Pvt Ltd",
      location: "Hyderabad, India",
      technologies: ["Frontend", "Backend", "Agile"],
      roles: [
        {
          role: "Senior Developer",
          period: "Jan 2021 - Sep 2022",
          description:
            "Delivered end-to-end product solutions from analysis to release. Worked on scalable applications as an Application Developer.",
        },
        {
          role: "Junior Developer",
          period: "Sep 2019 - Dec 2020",
          description:
            "Developed features for enterprise applications, focusing on frontend state management in an agile team.",
        },
      ],
    },
  ]);

  // Education
  await Education.deleteMany({});
  await Education.insertMany([
    {
      degree: "Bachelor of Technology",
      field: "Computer Science & Engineering",
      institution: "Guru Nanak Institution's Technical Campus, Hyderabad",
      location: "Hyderabad, India",
      startYear: 2016,
      endYear: 2019,
      percentage: undefined,
      description:
        "Focused on software engineering principles, system design, and full-stack development.",
    },
    {
      degree: "Diploma",
      field: "Computer Science & Engineering",
      institution: "Govt Polytechnic Masab Tank, Hyderabad",
      location: "Hyderabad, India",
      startYear: 2013,
      endYear: 2016,
      percentage: undefined,
      description:
        "Built a strong foundation in computer science fundamentals and applied programming.",
    },
    {
      degree: "Schooling",
      field: "Science",
      institution: "ZPHS Pochampally",
      location: "Pochampally, Nalgonda",
      startYear: 2013,
      endYear: 2013,
      percentage: undefined,
      description: "Completed high school education with focus on science.",
    },
  ]);

  // Projects
  await Project.deleteMany({});
  await Project.insertMany([
    // Professional Projects
    {
      title: "Fleet Manager – GE HealthCare (PCS)",
      description:
        "Fleet Manager helps healthcare facilities overcome operational challenges. It supports patient monitoring across devices, consolidates service strategies, and improves uptime, processes, and patient care.",
      techStack: ["React.js", "Node.js", "Redux.js", "Jest", "MUI"],
      role: "Full-Stack Developer",
      duration: "2 Years (2022-24)",
      type: "Professional",
    },
    {
      title: "iDestination – An Area Information Tool",
      description:
        "A complete guide providing information on community, education, housing, and activities for cities worldwide. Designed to support employees and students relocating to new areas.",
      techStack: [
        "React.js",
        "Node.js",
        "Webpack",
        "ElasticCache",
        "MySQL",
        "AntD",
      ],
      role: "Full-Stack Developer",
      duration: "1 Year (2021-22)",
      type: "Professional",
    },
    {
      title: "Notfii – Community App",
      description:
        "Notfii is a package tracking software designed for residential communities, universities, and corporate campuses, streamlining delivery notifications and community interactions.",
      techStack: ["React.js", "Node.js", "MongoDB", "MySQL"],
      role: "Full-Stack Developer",
      duration: "1 Year (2021)",
      type: "Professional",
    },

    // Personal Projects
    {
      title: "Portfolio Website",
      description:
        "Designed and developed my personal portfolio website to showcase projects, experience, and skills with an elegant modern UI.",
      techStack: ["Next.js", "Tailwind", "Node.js"],
      role: "Full-Stack Developer",
      duration: "2023",
      type: "Personal",
    },
    {
      title: "AI-Powered Report Manager",
      description:
        "A report management web app with role-based access, notifications, file uploads to AWS S3, and AI-driven analytics for enterprise usage.",
      techStack: [
        "React",
        "Node.js",
        "MongoDB",
        "DynamoDB",
        "Firebase",
        "SendGrid",
      ],
      role: "MERN Developer",
      duration: "2024",
      type: "Personal",
    },
  ]);

  // Blogs
  await Blog.deleteMany({});
  await Blog.insertMany([
    {
      title: "Mastering React Performance",
      summary:
        "Performance optimization in React apps is critical for creating smooth user experiences. Techniques covered: memoization, code-splitting, lazy loading, and reducing unnecessary renders.",
      publishedDate: new Date("2024-08-01"),
      url: "/blog/mastering-react-performance",
      tags: ["React", "Performance", "Frontend"],
      category: "React",
    },
    {
      title: "Building Scalable APIs with Node.js",
      summary:
        "Best practices for building robust, scalable APIs with Node.js and Express: request validation, rate limiting, pagination, and error handling patterns.",
      publishedDate: new Date("2024-07-01"),
      url: "/blog/scalable-nodejs-apis",
      tags: ["Node.js", "API", "Backend"],
      category: "APIs",
    },
    {
      title: "Journey into Freelancing",
      summary:
        "Lessons learned in the first year of freelancing: client communication, pricing strategies, time management, and building a repeatable onboarding process.",
      publishedDate: new Date("2024-06-01"),
      url: "/blog/journey-into-freelancing",
      tags: ["Career", "Freelance", "Productivity"],
      category: "Career",
    },
    {
      title: "Deploying Node.js Apps to AWS (Practical Guide)",
      summary:
        "A step-by-step guide to deploy Node.js applications on AWS using ECS, Fargate, and S3 for static assets — includes CI/CD tips and cost-saving suggestions.",
      publishedDate: new Date("2024-09-01"),
      url: "/blog/deploying-nodejs-aws",
      tags: ["AWS", "DevOps", "Node.js"],
      category: "DevOps",
    },
    {
      title: "Accessibility-first UI Design",
      summary:
        "Practical accessibility techniques for web UIs: semantic HTML, ARIA where needed, keyboard navigation, color contrast, and testing strategies.",
      publishedDate: new Date("2024-05-15"),
      url: "/blog/accessibility-ui-design",
      tags: ["Accessibility", "UX", "Frontend"],
      category: "UX",
    },
    {
      title: "Migrating from REST to GraphQL: A Practical Approach",
      summary:
        "When and how to introduce GraphQL in an existing REST codebase, schema design tips, performance considerations, and incremental migration patterns.",
      publishedDate: new Date("2024-04-10"),
      url: "/blog/migrating-rest-to-graphql",
      tags: ["GraphQL", "API", "Backend"],
      category: "Backend",
    },
  ]);

  // Profile
  await Profile.deleteMany({});
  await Profile.create({
    firstName: "Ravinder",
    lastName: "Varikuppala",
    nationality: "Indian",
    freelance: "Available",
    phone: "+91 9512955330",
    email: "it.ravinder.456@gmail.com",
    address: "Hyderabad, India",
    languages: ["English", "Hindi", "Telugu"],
    yearsOfExperience: 6,
    completedProjects: 11,
    happyClients: 4,
    awardsWon: 4,
    summary:
      "Experienced MERN stack developer with 5+ years of expertise in building scalable web applications. Passionate about learning new technologies and solving complex problems.",
  });

  // Achievements
  await Achievement.deleteMany({});
  await Achievement.insertMany([
    {
      title: "A-TEAM SPOT ON",
      description:
        "Awarded for delivering the product to the client ahead of schedule.",
      date: new Date("2023-06-01"),
      company: "LTIMindtree",
    },
    {
      title: "2× Problem Solver Gracias",
      description:
        "Recognized for solving critical hotfixes swiftly at LTIMindtree.",
      date: new Date("2022-11-01"),
      company: "LTIMindtree",
    },
    {
      title: "Super Crew",
      description: "Honored for outstanding teamwork and delivery excellence.",
      date: new Date("2021-09-01"),
      company: "LTIMindtree",
    },
  ]);

  console.log("Database seeded!");
  await mongoose.disconnect();
}

// seed().catch(console.error);
