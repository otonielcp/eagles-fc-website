import type { JobInput } from "@/lib/hiring";

/**
 * Starting points for common club roles. Picking one only pre-fills the form;
 * compensation, dates and team are left blank because they differ every time.
 */
export const JOB_TEMPLATES: { name: string; job: Partial<JobInput> }[] = [
  {
    name: "Head Coach",
    job: {
      title: "Head Coach",
      department: "coaching",
      employmentType: "part_time",
      summary:
        "Lead one of our youth teams through training and match days, developing players' technique, understanding of the game and love of soccer.",
      description:
        "Our head coaches set the tone for their team. You will plan and run training sessions, manage match days, and be the main point of contact for players and families, while working within the club's coaching curriculum and player-development philosophy.",
      responsibilities: [
        "Plan and run age-appropriate training sessions (typically 2–3 per week)",
        "Coach the team on match days and at tournaments",
        "Track player development and give regular, constructive feedback",
        "Communicate schedules and updates with parents and the team manager",
        "Model good sportsmanship and uphold the club's code of conduct",
      ],
      requirements: [
        "Previous coaching experience with youth players",
        "US Soccer Grassroots license, or willingness to earn one within your first season",
        "Current SafeSport training and a cleared background check before starting",
        "Reliable availability on weekday evenings and weekends during the season",
      ],
      preferred: [
        "US Soccer D license or higher",
        "Bilingual in English and Spanish",
        "Competitive playing experience",
      ],
      benefits: [],
    },
  },
  {
    name: "Assistant Coach",
    job: {
      title: "Assistant Coach",
      department: "coaching",
      employmentType: "volunteer",
      summary:
        "Support a head coach in training and on match days, and help our youth players grow on and off the field.",
      description:
        "Assistant coaches are a big part of what makes a team work. You will help run training activities, support players one-on-one, and learn alongside an experienced head coach. It's a great first step into coaching.",
      responsibilities: [
        "Help set up and run training activities",
        "Work with small groups and individual players",
        "Support the head coach on match days",
        "Help keep practices safe, organized and fun",
      ],
      requirements: [
        "A genuine interest in working with young players",
        "Current SafeSport training and a cleared background check before starting",
        "Availability for most practices and match days during the season",
      ],
      preferred: ["Some playing or coaching experience", "US Soccer Grassroots license"],
      benefits: [],
    },
  },
  {
    name: "Goalkeeper Coach",
    job: {
      title: "Goalkeeper Coach",
      department: "coaching",
      employmentType: "part_time",
      summary:
        "Run specialized goalkeeper training across our age groups and help build confident, technically sound keepers.",
      description:
        "You will design and deliver goalkeeper-specific sessions, work with keepers across several teams, and coordinate with head coaches so goalkeeping development fits each team's plan.",
      responsibilities: [
        "Plan and lead goalkeeper training sessions for multiple age groups",
        "Teach handling, footwork, distribution, positioning and decision-making",
        "Share progress notes with each keeper's head coach",
        "Support keepers on match days when available",
      ],
      requirements: [
        "Goalkeeping experience as a player or coach",
        "Current SafeSport training and a cleared background check before starting",
        "Availability on weekday evenings during the season",
      ],
      preferred: ["Goalkeeping license (US Soccer or United Soccer Coaches)"],
      benefits: [],
    },
  },
  {
    name: "Club Administrator",
    job: {
      title: "Club Administrator",
      department: "administration",
      employmentType: "part_time",
      summary:
        "Keep the club running smoothly: registration, scheduling, family communication and day-to-day operations.",
      description:
        "The club administrator is the organizational heart of Eagles FC. You will manage player registration and records, coordinate schedules and fields, answer questions from families, and support coaches and the board with the details that keep everything moving.",
      responsibilities: [
        "Manage player registration, rosters and club records",
        "Coordinate practice and game schedules, fields and referees",
        "Answer family and coach questions by email and phone",
        "Track payments and support basic bookkeeping",
        "Help organize club events, tryouts and tournaments",
      ],
      requirements: [
        "Strong organization and attention to detail",
        "Clear, friendly written and verbal communication",
        "Comfortable with spreadsheets, email and online tools",
        "A background check before starting (this role works with player records)",
      ],
      preferred: [
        "Experience in youth sports, school or nonprofit administration",
        "Bilingual in English and Spanish",
      ],
      benefits: [],
    },
  },
];
